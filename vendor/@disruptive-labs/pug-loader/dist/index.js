"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const pug_1 = __importDefault(require("pug"));
const pug_walk_1 = __importDefault(require("pug-walk"));
function pugLoader(source) {
    var _a, _b;
    const context = this;
    const options = context.getOptions() || {};
    const filename = context.resourcePath;
    // Make sure loader result is cacheable
    (_a = this.cacheable) === null || _a === void 0 ? void 0 : _a.call(this, true);
    // Pug plugin to convert non-pug includes with `require` calls
    // NOTE: Using `require` directly in the template is recommended over includes
    const pugIncludesPlugin = {
        preLink(ast) {
            return (0, pug_walk_1.default)(ast, (node, replace) => {
                if (node.type === 'RawInclude' &&
                    node.file &&
                    path_1.default.extname(node.file.fullPath) !== '.pug') {
                    const val = `require(${JSON.stringify(context.utils.contextify(context.context || context.rootContext, node.file.fullPath))})`;
                    replace({
                        type: 'Code',
                        val,
                        buffer: true,
                        mustEscape: false,
                        isInline: false,
                        line: node.line,
                        filename: node.filename,
                    });
                }
            });
        },
    };
    try {
        const pugOptions = {
            filename,
            doctype: options.doctype || 'html',
            pretty: options.pretty,
            self: options.self,
            basedir: options.basedir,
            compileDebug: false,
            globals: ['require'].concat(options.globals || []),
            inlineRuntimeFunctions: false,
            name: 'template',
            filters: options.filters,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            plugins: [pugIncludesPlugin].concat(options.plugins || []),
        };
        const compiled = pug_1.default.compileClientWithDependenciesTracked(source.toString(), pugOptions);
        if ((_b = compiled.dependencies) === null || _b === void 0 ? void 0 : _b.length) {
            compiled.dependencies.forEach((dep) => {
                context.addDependency(dep);
            });
        }
        context.callback(null, `var pug=require('pug-runtime');\n${compiled.body}\nmodule.exports=template;`);
    }
    catch (err) {
        // console.log(err);
        // context.addDependency(path.normalize(err.filename));
        context.callback(err);
    }
}
exports.default = pugLoader;
