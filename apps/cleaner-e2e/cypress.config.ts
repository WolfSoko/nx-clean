import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      webServerCommands: {
        default: 'npx nx run cleaner:serve:development',
        production: 'npx nx run cleaner:serve:production',
      },
    }),
    baseUrl: 'http://localhost:4200/',
  },
});
