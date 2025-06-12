import type { PluginObj } from '@babel/core';
import * as t from '@babel/types';

interface IPluginOptions {
  attrName?: string;
  enabled?: boolean;
}

export default function plugin(babel: typeof import('@babel/core'), pluginOptions: IPluginOptions = {}): PluginObj {
  const { types: t } = babel;

  const {
    attrName = 'data-visible',
    enabled = true,
  } = pluginOptions;

  return {
    visitor: {
      JSXElement(path, state) {
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
          attr => t.isJSXAttribute(attr) && attr.name.name === attrName
        );

        if (attrIndex !== -1) {
          const visibleAttrNode = attrs[attrIndex];
          // @ts-expect-error
          const condition = visibleAttrNode.value?.expression || t.booleanLiteral(true);

          attrs.splice(attrIndex, 1);

          path.replaceWith(
            // @ts-expect-error
            t.ExpressionStatement(
              t.logicalExpression('&&', condition, path.node)
            )
          );
        }
      },
    },
  };
};
