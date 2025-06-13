module.exports = {
  '**/packages/babel-plugin-react-visibility-attribute/**/*.{ts,tsx,js,jsx}': [
    'pnpm --filter @kas-tools/babel-plugin-react-visibility-attribute run lint',
    'pnpm --filter @kas-tools/babel-plugin-react-visibility-attribute run format',
    'pnpm --filter @kas-tools/babel-plugin-react-visibility-attribute run test --passWithNoTests',
  ],
  '**/*.{md,json}': ['prettier --write'],
}
