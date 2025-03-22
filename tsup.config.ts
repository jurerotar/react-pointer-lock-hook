import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/use-pointer-lock.ts'],
  target: 'esnext',
  format: ['esm'],
  dts: true,
  clean: true,
});
