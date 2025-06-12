import type { PluginObj } from '@babel/core';
interface IPluginOptions {
    attrName?: string;
    enabled?: boolean;
}
export default function defineVisibilityBabelPlugin(babel: typeof import('@babel/core'), pluginOptions?: IPluginOptions): PluginObj;
export {};
//# sourceMappingURL=index.d.ts.map