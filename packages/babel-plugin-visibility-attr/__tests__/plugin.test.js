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
    input: {
      condition: '<SomeComponent data-if={condition} />',
      falsy: '<SomeComponent data-if={false} />',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      ast: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      jsx: 'condition && <SomeComponent />',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, null);',
    },
  },
  {
    input: {
      condition: '<SomeComponent data-if={condition}></SomeComponent>',
      falsy: '<SomeComponent data-if={false}></SomeComponent>',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      ast: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null);',
      jsx: 'condition && <SomeComponent></SomeComponent>;',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, null);',
    },
  },
  {
    input: {
      condition: '<SomeComponent data-if={condition}>test</SomeComponent>',
      falsy: '<SomeComponent data-if={false}>test</SomeComponent>',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, null, "test");',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent>test</SomeComponent>;',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, null, "test");',
    },
  },
  {
    input: {
      condition: '<SomeComponent data-if={condition} open={true}>test</SomeComponent>',
      falsy: '<SomeComponent data-if={false} open={true}>test</SomeComponent>',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, { open: true }, "test");',
      ast: 'React.createElement(SomeComponent',
      jsx: 'condition && <SomeComponent open={true}>test</SomeComponent>;',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, { open: true }, "test");',
    },
  },
  {
    input: {
      condition: '<SomeComponent data-if={condition} open={true} {...props}>test</SomeComponent>',
      falsy: '<SomeComponent data-if={false} open={true} {...props}>test</SomeComponent>',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open:true},props), "test");',
      ast: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open:true},props), "test");',
      jsx: 'condition && <SomeComponent open={true} {...props}>test</SomeComponent>;',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open:true }, props), "test");',
    },
  },
  {
    input: {
      condition: '<SomeComponent data-if={condition} open={true} {...props}><div>test</div></SomeComponent>',
      falsy: '<SomeComponent data-if={false} open={true} {...props}><div>test</div></SomeComponent>',
    },
    output: {
      transformed: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open: true }, props),/*#__PURE__*/React.createElement("div", null, "test"));',
      ast: 'condition && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open: true }, props),/*#__PURE__*/React.createElement("div", null, "test"));',
      jsx: 'condition && <SomeComponent open={true} {...props}><div>test</div></SomeComponent>;',
      falsy: 'false && /*#__PURE__*/React.createElement(SomeComponent, _extends({ open: true }, props),/*#__PURE__*/React.createElement("div", null, "test"));',
    },
  },
];

describe('babel-plugin-react-visibility-attribute', () => {
  each.default(POSSIBLE_CASES).describe('when transforming %s', (testCase) => {
    it('should match transformed output', () => {
      const result = transformWrapper(testCase.input.condition).code;

      expect(normalize(result)).toContain(normalize(testCase.output.transformed));
    });

    it('should match transformed output (with false)', () => {
      const result = transformWrapper(testCase.input.falsy).code;

      expect(normalize(result)).toContain(normalize(testCase.output.falsy));
    });

    it('should match AST structure', () => {
      const astResult = transformWrapper(testCase.input.condition, {}, { ast: true }).ast;
      const printed = generator.generate(astResult).code;

      expect(normalize(printed)).toContain(normalize(testCase.output.ast));
    });

    it('should preserve JSX intention', () => {
      const result = babel.transformSync(testCase.input.condition, {
        plugins: [["@babel/plugin-syntax-jsx"], [plugin, {}]],
        configFile: false,
        ast: false,
      });

      expect(result.code).toContain(testCase.output.jsx);
    });

    it('should match snapshot', () => {
      const result = transformWrapper(testCase.input.condition).code;

      expect(result).toMatchSnapshot();
    });
  });
});
