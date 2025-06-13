module.exports = {
  '**/*.(js|ts|tsx|jsx)': [
    'eslint --fix',
    'prettier --write',
    'jest --bail --findRelatedTests',
  ],
  '**/*.(md|json)': ['prettier --write'],
};
