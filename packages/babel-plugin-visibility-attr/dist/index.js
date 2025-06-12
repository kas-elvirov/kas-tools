export default function plugin(babel, pluginOptions = {}) {
    const { types: t } = babel;
    const { attrName = 'data-visible', enabled = true, } = pluginOptions;
    return {
        visitor: {
            JSXElement(path, state) {
                var _a;
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
                const attrIndex = attrs.findIndex(attr => t.isJSXAttribute(attr) && attr.name.name === attrName);
                if (attrIndex !== -1) {
                    const visibleAttrNode = attrs[attrIndex];
                    // @ts-expect-error
                    const condition = ((_a = visibleAttrNode.value) === null || _a === void 0 ? void 0 : _a.expression) || t.booleanLiteral(true);
                    attrs.splice(attrIndex, 1);
                    path.replaceWith(
                    // @ts-expect-error
                    t.ExpressionStatement(t.logicalExpression('&&', condition, path.node)));
                }
            },
        },
    };
}
;
//# sourceMappingURL=index.js.map