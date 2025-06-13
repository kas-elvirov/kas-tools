#!/bin/bash

set -e

echo "📦 Installing husky and initializing..."
pnpm dlx husky-init > /dev/null

echo "🔧 Add prepare-script into package.json (if it's not there)..."
if ! grep -q '"prepare": "husky install"' package.json; then
  npx json -I -f package.json -e 'this.scripts.prepare = "husky install"'
fi

echo "✅ Done with pre-commit hook: running lint-staged"
echo '#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged' > .husky/pre-commit
chmod +x .husky/pre-commit

echo "✅ Creating commit-msg hook for commitlint..."
echo '#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm commitlint --edit "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg

echo "🎉 Husky ready to rock!"
