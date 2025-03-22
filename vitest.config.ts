import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: false,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
