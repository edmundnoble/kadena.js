import type { PlaywrightTestConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

const config: PlaywrightTestConfig = {
  ...baseConfig,
  webServer: {
    // we explicitly use the start command here because docs dev is seriously slow.
    command: `pnpm --filter @kadena/docs start`,
    url: 'http://localhost:3000',
    reuseExistingServer: process.env.CI === undefined,
  },
  projects: [
    {
      name: 'docs',
      testDir: 'src/tests/docs-app/',
    },
  ],
};

export default config;
