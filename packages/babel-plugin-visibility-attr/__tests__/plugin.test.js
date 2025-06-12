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

const DATA = {
  INPUT: '<SomeComponent data-visible={condition} />',
  OUTPUT: {
    /**
     * Doesn't quite beautiful what we see in "toContain"
     * but it's what we are expecting for
     * - condition && <SomeComponent />
    */
    transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
    ast: 'React.createElement(SomeComponent',
    jsx: 'condition && <SomeComponent />',
  },
};

const transform = (code, opts = {}) =>
  babel.transform(code, {
    filename: 'file.jsx',
    presets: ['@babel/preset-react'],
    plugins: [[plugin, opts]],
    configFile: false,
  }).code;

describe('babel-plugin-visibility-attr', () => {
  it('main test (with react transformation)', () => {
    const output = transform(DATA.INPUT);

    expect(output).toContain(DATA.OUTPUT.transformed);
  });

  it('AST test', () => {
    const outputAST = babel.transform(DATA.INPUT, {
      filename: 'file.jsx',
      presets: ['@babel/preset-react'],
      plugins: [[plugin, {}]],
      configFile: false,
      ast: true,
    }).ast;

    const printed = generator.generate(outputAST).code;

    expect(printed).toContain(DATA.OUTPUT.ast);
  });

  it('snapshot test', () => {
    const result = transform(DATA.INPUT);

    expect(result).toMatchSnapshot();
  });

  it('jsx test', () => {
    const result = babel.transformSync(DATA.INPUT, {
      plugins: [["@babel/plugin-syntax-jsx", {}], [plugin, {}]],
      configFile: false,
      ast: false,
    });

    expect(result.code).toContain(DATA.OUTPUT.jsx);
  });
});
