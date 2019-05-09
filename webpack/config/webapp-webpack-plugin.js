// tslint:disable:quotemark
// tslint:disable:object-literal-sort-keys
const bikeshed = require('./bikeshed.js');

module.exports = (callback) => {
    return {
        logo: './assets/images/logo.svg',
        prefix: bikeshed.assetVersions ? 'icons/[hash:8]' : 'icons',
        inject: callback,
        favicons: {
            appName: 'Bikeshed',
            appDescription: '',
            developerName: 'Maintainerati Project',
            developerURL: 'https://github.com/maintainerati/bikeshed',
            icons: {
                coast: false,
                yandex: false,
            },
        },
    };
};
