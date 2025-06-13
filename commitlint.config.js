import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const config = await import(
  resolve(__dirname, './packages/internal-scripts/config/commitlint.config.js')
)

export default config.default
