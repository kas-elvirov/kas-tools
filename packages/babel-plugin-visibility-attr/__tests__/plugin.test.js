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

const transformWrapper = (code, opts = {}, transformOpts = {}) => {
  return babel.transform(code, {
    filename: 'file.jsx',
    presets: ['@babel/preset-react'],
    plugins: [[plugin, opts]],
    configFile: false,
    ...transformOpts,
  });
}

describe('babel-plugin-visibility-attr', () => {
  it('main test (with react transformation)', () => {
    const output = transformWrapper(DATA.INPUT).code;

    expect(output).toContain(DATA.OUTPUT.transformed);
  });

  it('main test (snapshot)', () => {
    const result = transformWrapper(DATA.INPUT).code;

    expect(result).toMatchSnapshot();
  });

  it('ast test', () => {
    const output = transformWrapper(DATA.INPUT, {}, { ast: true }).ast;

    const printed = generator.generate(output).code;

    expect(printed).toContain(DATA.OUTPUT.ast);
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
