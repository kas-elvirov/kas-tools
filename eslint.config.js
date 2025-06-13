import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const config = await import('./packages/internal-scripts/config/eslint.js')

export default [...config.default]
