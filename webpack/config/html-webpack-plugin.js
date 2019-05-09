// tslint:disable:quotemark
// tslint:disable:object-literal-sort-keys
const bikeshed = require('./bikeshed.js');

module.exports = (encore) => {
    return {
        template: './assets/html/default_index.ejs',
        // templateParameters: templateParametersGenerator,
        filename: 'asset.dom.html',
        hash: bikeshed.assetVersions,
        inject: true,
        compile: true,
        favicon: false,
        minify: encore.isProduction(),
        cache: true,
        showErrors: true,
        chunks: 'all',
        excludeChunks: [],
        chunksSortMode: 'auto',
        meta: {},
        title: 'Bikeshed',
        xhtml: false,
    };
};
