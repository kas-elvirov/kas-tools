const babel = require('@babel/core');
const generator = require('@babel/generator');

const plugin = require('../index');

const possibleCases = [
  ['<MyComponent data-visible={isVisible} />'],
  ['<MyComponent data-visible={isVisible}></MyComponent>'],
  ['<MyComponent data-visible={isVisible}>test</MyComponent>'],
  ['<MyComponent data-visible={isVisible} open={true}>test</MyComponent>'],
  ['<MyComponent data-visible={isVisible} open={true} {...props}>test</MyComponent>'],
  ['<MyComponent data-visible={isVisible} open={true} {...props}><div>test</div></MyComponent>'],
]

const transform = (code, opts = {}) =>
  babel.transform(code, {
    filename: 'file.jsx',
    presets: ['@babel/preset-react'],
    plugins: [[plugin, opts]],
    configFile: false,
  }).code;

describe('babel-plugin-visibility-attr', () => {
  it('main test (with react transformation)', () => {
    const output = transform('<Box data-visible={condition} />');

    /**
     * Doesn't quite beautiful what we see in "toContain"
     * but it's what we are expecting for
     * - condition && <Box />
    */
    expect(output).toContain('condition && /*#__PURE__*/React.createElement(Box, null);');
  });

  it('AST test', () => {
    const outputAST = babel.transform('<Box data-visible={condition} />', {
      filename: 'file.jsx',
      presets: ['@babel/preset-react'],
      plugins: [[plugin, {}]],
      configFile: false,
      ast: true,
    }).ast;

    const printed = generator.generate(outputAST).code;

    expect(printed).toContain('React.createElement(Box');
  });

  it('snapshot test', () => {
    const result = transform('<Box data-visible={condition} />');

    expect(result).toMatchSnapshot();
  });

  it('jsx test', () => {
    const result = babel.transformSync('<Box data-visible={condition} />', {
      plugins: [["@babel/plugin-syntax-jsx", {}], [plugin, {}]],
      configFile: false,
      ast: false,
    });

    expect(result.code).toContain('condition && <Box />');
  });
});
