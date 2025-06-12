const each = require('jest-each');

const babel = require('@babel/core');
const generator = require('@babel/generator');

const plugin = require('../src/index');

/**
 * Just wrapper to write less code
*/
const transformWrapper = (code, opts = {}, transformOpts = {}) => {
  return babel.transform(code, {
    filename: 'file.jsx',
    presets: ['@babel/preset-react'],
    plugins: [[plugin, opts]],
    configFile: false,
    ...transformOpts,
  });
};

/**
 * Normalization of strings that differ slightly in formatting but are semantically identical
*/
const normalize = str => {
  return str.replace(/\s+/g, '');
};

/**
 * # All possible cases
 *
 * Transformed cases comment:
 * - outputs for then are Doesn't quite beautiful what we see in "toContain"
 * but it's what we are expecting for
 * - condition && <SomeComponent />
*/
const POSSIBLE_CASES = [
  {
    input: '<SomeComponent data-visible={condition} />',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent />',
    },
  },
  {
    input: '<SomeComponent data-visible={condition}></SomeComponent>',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent></SomeComponent>',
    },
  },
  {
    input: '<SomeComponent data-visible={condition}>test</SomeComponent>',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null, "test");',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent>test</SomeComponent>',
    },
  },
  {
    input: '<SomeComponent data-visible={condition} open={true}>test</SomeComponent>',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, { open: true }, "test");',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent open={true}>test</SomeComponent>',
    },
  },
  {
    input: '<SomeComponent data-visible={condition} open={true} {...props}>test</SomeComponent>',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open: true }, props), "test");',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent open={true} {...props}>test</SomeComponent>',
    },
  },
  {
    input: '<SomeComponent data-visible={condition} open={true} {...props}><div>test</div></SomeComponent>',
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open: true }, props), /*#__PURE__*/React.createElement("div",null,"test"));',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent open={true} {...props}><div>test</div></SomeComponent>',
    },
  },
];

describe('babel-plugin-visibility-attr', () => {
  each.default(POSSIBLE_CASES).describe('when transforming %s', (testCase) => {
    it('should match transformed output', () => {
      const result = transformWrapper(testCase.input).code;

      expect(normalize(result)).toContain(normalize(testCase.output.transformed));
    });

    it('should match AST structure', () => {
      const astResult = transformWrapper(testCase.input, {}, { ast: true }).ast;
      const printed = generator.generate(astResult).code;

      expect(printed).toContain(testCase.output.ast);
    });

    it('should preserve JSX intention', () => {
      const result = babel.transformSync(testCase.input, {
        plugins: [["@babel/plugin-syntax-jsx"], [plugin, {}]],
        configFile: false,
        ast: false,
      });

      expect(result.code).toContain(testCase.output.jsx);
    });

    it('should match snapshot', () => {
      const result = transformWrapper(testCase.input).code;

      expect(result).toMatchSnapshot();
    });
  });
});
