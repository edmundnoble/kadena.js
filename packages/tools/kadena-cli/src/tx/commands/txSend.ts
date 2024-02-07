import type { Command } from 'commander';
import debug from 'debug';

import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { createClient, isSignedTransaction } from '@kadena/client';
import path from 'node:path';
import { clientSendWrapper } from '../../utils/client.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { txOptions } from '../txOptions.js';
import { getTransactionsFromFile } from '../utils/txHelpers.js';

// import { globalOptions } from '../../utils/globalOptions.js';

/*

kadena tx send ??
*/
type IAnyCommand = IUnsignedCommand | ICommand;
const isFilePaths = (
  transactions: IAnyCommand[] | string[],
): transactions is string[] => {
  return typeof transactions[0] === 'string';
};
interface ISubmitResponse {
  transaction: IAnyCommand;
  requestKey: string;
}

export const sendTransactionAction = async ({
  chainId,
  networkHost,
  networkId,
  transactions: transactionsInput,
}: {
  networkId: string;
  networkHost: string;
  chainId: string;
  /** Command object of filepath to JSON file with command object */
  transactions: IAnyCommand[] | string[];
}): Promise<
  CommandResult<{
    transactions: ISubmitResponse[];
  }>
> => {
  const client = createClient(
    `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

  let transactions: IAnyCommand[] = [];

  if (isFilePaths(transactionsInput)) {
    transactions = await getTransactionsFromFile(transactionsInput, true);
  }

  const successfulCommands: ISubmitResponse[] = [];
  const errors: string[] = [];

  for (const command of transactions) {
    try {
      if (!isSignedTransaction(command)) {
        errors.push(`Invalid signed transaction: ${JSON.stringify(command)}`);
        continue;
      }

      const response = await clientSendWrapper(() => client.submit(command));

      successfulCommands.push({
        transaction: command,
        requestKey: response.requestKey,
      });
    } catch (error) {
      errors.push(`Error in processing transaction: ${error.message}`);
    }
  }

  if (errors.length === transactions.length) {
    return { success: false, errors };
  } else if (errors.length > 0) {
    return {
      success: true,
      data: { transactions: successfulCommands },
      warnings: errors,
    };
  }

  return { success: true, data: { transactions: successfulCommands } };
};

export const createSendTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'send',
  'send a transaction to the network',
  [
    txOptions.txTransactionDir({ isOptional: true }),
    txOptions.txSignedTransactionFiles(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (config) => {
    debug('send-transaction:action')({ config });

    const absolutePaths = config.txSignedTransactionFiles.map((file) =>
      path.resolve(path.join(config.txTransactionDir, file)),
    );

    const result = await sendTransactionAction({
      ...config.networkConfig,
      chainId: config.chainId,
      transactions: absolutePaths,
    });
    assertCommandError(result);

    console.log(
      result.data.transactions
        .map(
          (transaction) =>
            `Transaction: ${transaction.transaction.hash} submitted with request key: ${transaction.requestKey}`,
        )
        .join('\n\n'),
    );
  },
);
