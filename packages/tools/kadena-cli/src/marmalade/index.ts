import { marmaladeCreateTokenCommandFactory } from './commands/marmaladeCreateToken.js';
import { mintCommand } from './commands/marmaladeMint.js';

import type { Command } from 'commander';

const SUBCOMMAND_ROOT: 'marmalade' = 'marmalade';

export function marmaladeCommandFactory(
  program: Command,
  version: string,
): void {
  const marmaladeProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Tool for minting and managing NFTs with Marmalade`);

  marmaladeCreateTokenCommandFactory(marmaladeProgram, version);
  mintCommand(marmaladeProgram, version);
}
