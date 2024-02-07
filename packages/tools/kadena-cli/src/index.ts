#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';

import { loadProgram } from './program.js';

async function main(): Promise<void> {
  let stdin: string = '';
  try {
    stdin = readFileSync(0, 'utf8');
  } catch (e) {
    /* empty */
  }

  process.argv.push(stdin);

  await loadProgram(new Command()).parseAsync();

  // TODO: test if this is needed
  // ttys.stdin.destroy();
}

main().catch(console.error);
