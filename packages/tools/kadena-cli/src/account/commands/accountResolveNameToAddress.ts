import chalk from 'chalk';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { kdnResolveNameToAddress } from '../utils/txKdnResolverChain.js';

export const resolveNameToAddress = async (
  name: string,
  network: 'testnet' | 'mainnet',
  networkId: string,
  networkHost: string,
): Promise<CommandResult<{ commands: string | undefined }>> => {
  try {
    const result = await kdnResolveNameToAddress(
      name,
      network,
      networkId,
      networkHost,
    );

    if (result === undefined) {
      return {
        success: false,
        errors: [`No address found for name: ${name}`],
      };
    }
    return { success: true, data: { commands: result } };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in name resolving action: ${error.message}`],
    };
  }
};

export const resolveNameToAddressCommand = createCommandFlexible(
  'resolve-name-to-address',
  'Resolve an .kda name (with kadenanames) to a k:address',
  [globalOptions.network(), globalOptions.accountKdnName()],
  async (option) => {
    const kadena = await option.network({
      allowedNetworks: ['mainnet', 'testnet'],
    });
    const kadenaName = await option.accountKdnName();

    debug.log('resolve-address-to-name', {
      ...kadena,
      ...kadenaName,
    });

    const result = await resolveNameToAddress(
      kadenaName.accountKdnName,
      kadena.network as 'testnet' | 'mainnet',
      kadena.networkConfig.networkId,
      kadena.networkConfig.networkHost,
    );

    assertCommandError(result);

    console.log(chalk.green(`address: ${result.data.commands}`));
  },
);
