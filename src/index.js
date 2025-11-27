const fs = require('fs');
const path = require('path');
const { compileTemplate } = require('@jqhtml/parser');

/**
 * jqhtml esbuild plugin
 *
 * Compiles .jqhtml template files to JavaScript ES modules.
 *
 * @param {Object} options - Plugin options
 * @param {boolean} [options.sourcemap=true] - Enable source maps
 * @returns {Object} esbuild plugin
 */
function jqhtmlPlugin(options = {}) {
    const {
        sourcemap = true,
    } = options;

    return {
        name: 'jqhtml',

        setup(build) {
            // Handle .jqhtml files
            build.onLoad({ filter: /\.jqhtml$/ }, async (args) => {
                const source = await fs.promises.readFile(args.path, 'utf8');

                try {
                    const compiled = compileTemplate(source, args.path, {
                        format: 'esm',
                        sourcemap,
                    });

                    const output = `
${compiled.code}

// Export component name for manual registration
export const __jqhtml_component_name = ${JSON.stringify(compiled.componentName)};
`;

                    return {
                        contents: output,
                        loader: 'js',
                    };
                } catch (error) {
                    // Format error message
                    let message = error.message || 'jqhtml compilation failed';

                    if (error.context) {
                        message += `\n\nContext: ${error.context}`;
                    }
                    if (error.suggestion) {
                        message += `\nSuggestion: ${error.suggestion}`;
                    }

                    return {
                        errors: [{
                            text: message,
                            location: error.line ? {
                                file: args.path,
                                line: error.line,
                                column: error.column || 0,
                            } : null,
                        }],
                    };
                }
            });
        },
    };
}

module.exports = jqhtmlPlugin;
module.exports.default = jqhtmlPlugin;
module.exports.jqhtmlPlugin = jqhtmlPlugin;
