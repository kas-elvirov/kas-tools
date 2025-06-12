const babel = require('@babel/core');
const generator = require('@babel/generator');

const plugin = require('../index');

const possibleCases = [
  ['<SomeComponent data-visible={isVisible} />'],
  ['<SomeComponent data-visible={isVisible}></SomeComponent>'],
  ['<SomeComponent data-visible={isVisible}>test</SomeComponent>'],
  ['<SomeComponent data-visible={isVisible} open={true}>test</SomeComponent>'],
  ['<SomeComponent data-visible={isVisible} open={true} {...props}>test</SomeComponent>'],
  ['<SomeComponent data-visible={isVisible} open={true} {...props}><div>test</div></SomeComponent>'],
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
    const output = transform('<SomeComponent data-visible={condition} />');

    /**
     * Doesn't quite beautiful what we see in "toContain"
     * but it's what we are expecting for
     * - condition && <SomeComponent />
    */
    expect(output).toContain('condition && /*#__PURE__*/React.createElement(SomeComponent, null);');
  });

  it('AST test', () => {
    const outputAST = babel.transform('<SomeComponent data-visible={condition} />', {
      filename: 'file.jsx',
      presets: ['@babel/preset-react'],
      plugins: [[plugin, {}]],
      configFile: false,
      ast: true,
    }).ast;

    const printed = generator.generate(outputAST).code;

    expect(printed).toContain('React.createElement(SomeComponent');
  });

  it('snapshot test', () => {
    const result = transform('<SomeComponent data-visible={condition} />');

    expect(result).toMatchSnapshot();
  });

  it('jsx test', () => {
    const result = babel.transformSync('<SomeComponent data-visible={condition} />', {
      plugins: [["@babel/plugin-syntax-jsx", {}], [plugin, {}]],
      configFile: false,
      ast: false,
    });

    expect(result.code).toContain('condition && <SomeComponent />');
  });
});
