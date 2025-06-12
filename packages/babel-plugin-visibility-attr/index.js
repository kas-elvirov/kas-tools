module.exports = function (babel, pluginOptions = {}) {
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
          const condition = visibleAttrNode.value?.expression || t.booleanLiteral(true);

          attrs.splice(attrIndex, 1);

          path.replaceWith(
            t.ExpressionStatement(
              t.logicalExpression('&&', condition, path.node)
            )
          );
        }
      },
    },
  };
};
