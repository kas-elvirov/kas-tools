import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = await import(
  resolve(__dirname, '../../packages/internal-scripts/config/prettier.config.js')
);

export default config.default;
