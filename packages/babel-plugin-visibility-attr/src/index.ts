import type { PluginObj } from '@babel/core';
import * as babelTypes from '@babel/types';


interface IPluginOptions {
  attrName?: string;
  enabled?: boolean;
}

export default function defineVisibilityBabelPlugin(babel: typeof import('@babel/core'), pluginOptions: IPluginOptions = {}): PluginObj {
  const { types: t } = babel;

  const {
    attrName = 'data-visible',
    enabled = true,
  } = pluginOptions;

  return {
    visitor: {
      JSXElement(path) {
        if (!enabled) {
          /**
           * Plugin is disabled
          */
          return;
        }

        /**
         * Plugin is enabled
        */

        const opening = path.node.openingElement;
        const attrs = opening.attributes;

        const attrIndex = attrs.findIndex(
          (attr) => t.isJSXAttribute(attr) && attr.name.name === attrName
        );

        if (attrIndex === -1) {
          return;
        }

        const attrNode = attrs[attrIndex];

        if (!t.isJSXAttribute(attrNode)) {
          return;
        }

        /**
         * Explanation regarding `attrValue`
         *
         * `attrNode.value?.expression` can be `JSXEmptyExpression`, `Identifier`, `BooleanLiteral` etc..
         * `logicalExpression` requires exactly `Expression`
         * We are garantying type without loosing sence in the code
         *
         * In total
         * - excluding `JSXEmptyExpression`
         * - casting to `Expression`
        */
        let attrValue: babelTypes.Expression = t.booleanLiteral(true);

        if (attrNode.value) {
          if (t.isJSXExpressionContainer(attrNode.value)) {
            /**
             * `t.isExpression()` is unique check which excluding `JSXEmptyExpression`
            */
            if (t.isExpression(attrNode.value.expression)) {
              attrValue = attrNode.value.expression;
            }
          } else if (t.isStringLiteral(attrNode.value)) {
            attrValue = attrNode.value;
          }
        }

        /**
         * Remove an attribute
        */
        attrs.splice(attrIndex, 1);

        const conditional = t.logicalExpression('&&', attrValue, path.node);

        const parent = path.parentPath;

        /**
         * If `JSXElement` insoide `JSX`, return `JSXExpressionContainer`
        */
        if (t.isJSXElement(parent?.node) || t.isJSXFragment(parent?.node)) {
          path.replaceWith(
            t.jsxExpressionContainer(conditional)
          );
        } else {
          /**
           * Otherwise - `ExpressionStatement`
          */
          path.replaceWith(
            t.expressionStatement(conditional)
          );
        }
      },
    },
  };
};
