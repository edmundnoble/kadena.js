import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IAccountDetailsResult } from '../types.js';
import type { IGetAccountDetailsParams } from '../utils/getAccountDetails.js';
import { getAccountDetailsFromChain } from '../utils/getAccountDetails.js';

export async function accountDetails(
  config: IGetAccountDetailsParams,
): Promise<CommandResult<IAccountDetailsResult>> {
  try {
    const accountDetails = await getAccountDetailsFromChain({ ...config });
    return {
      success: true,
      data: accountDetails,
    };
  } catch (error) {
    if (error.message.includes('row not found') === true) {
      return {
        success: false,
        errors: [
          `Account is not available on chain "${config.chainId}" of networkId "${config.networkId}"`,
        ],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
}

export const createAccountDetailsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'details',
  'Get details of an account',
  [
    globalOptions.accountSelect(),
    globalOptions.networkSelect(),
    globalOptions.chainId({ isOptional: false }),
  ],
  async (config) => {
    debug('account-details:action')({ config });

    const result = await accountDetails({
      accountName: config.accountConfig.name,
      chainId: config.chainId,
      networkId: config.networkConfig.networkId,
      networkHost: config.networkConfig.networkHost,
      fungible: config.accountConfig.fungible,
    });

    assertCommandError(result);

    console.log(
      chalk.green(`\nDetails of account "${config.accountConfig.name}":\n`),
    );
    console.log(chalk.green(`${JSON.stringify(result.data, null, 2)}`));
  },
);
