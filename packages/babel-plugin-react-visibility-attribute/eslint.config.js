import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseConfig = await import(
  resolve(__dirname, '../../packages/internal-scripts/config/eslint.js')
);

export default [
  ...baseConfig.default,
  {
    ignores: ['**/dist/**', '**/*.config.js', '**/*.config.ts', '**/*.d.ts'],
  },
];
