// tslint:disable:quotemark
// tslint:disable:object-literal-sort-keys
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom').JSDOM;
const xmlserializer = require('xmlserializer');

class WebpackBuildListeners {
    static callback(plugin) { return true; /* Enable injection */  }

    constructor(options) { this.options = options; }

    apply(compiler) {
        compiler.hooks.compilation.tap('CanelaApp', this.afterTemplateExecution);
        compiler.hooks.compilation.tap('CanelaApp', this.beforeEmit);
        compiler.hooks.compilation.tap('CanelaApp', this.afterEmit);
        compiler.hooks.make.tapAsync('CanelaApp', this.webappWebpackPluginBeforeEmit);
    }

    afterTemplateExecution(compilation) {
        HtmlWebpackPlugin.getHooks(compilation)
            .afterTemplateExecution.tapAsync('CanelaApp', (data, cb) => { cb(null, data); });
    }

    /**
     * Dump icon meta & links to a Twig template.
     */
    beforeEmit(compilation) {
        HtmlWebpackPlugin.getHooks(compilation)
            .beforeEmit.tapAsync('CanelaApp', (data, cb) => {
                const dom = new jsdom(data.html);
                const window = dom.window;
                const nodeList = window.document.querySelectorAll('meta, link');
                const file = __dirname + '/../src/Resources/views/_partials/favicons.html.twig';

                fs.writeFileSync(file, '');
                nodeList.forEach((element) => {
                        if (element.rel !== 'stylesheet') {
                            const html = xmlserializer.serializeToString(element);
                            fs.appendFileSync(file, `    ${html}\n`);
                        }
                    });

                cb(null, data);
            },
        );
    }

    /**
     * Write out a fresh critical CSS file.
     */
    afterEmit(compilation) {
        HtmlWebpackPlugin.getHooks(compilation)
            .afterEmit.tapAsync('CanelaApp', (data, cb) => {
                fs.writeFileSync(__dirname + '/../public/assets/critical.css', "\/* critical *\/\n");
                console.log('');
                cb(null, data);
            },
        );
    }

    webappWebpackPluginBeforeEmit(compilation, callback) {
        compilation.hooks
            .webappWebpackPluginBeforeEmit.tapAsync('CanelaApp', (result, cb) => {
            result.assets = result.assets.map((entry) => {
                return entry;
            });

            return cb(null, result);
        });

        return callback();
    }
}

module.exports = WebpackBuildListeners;
