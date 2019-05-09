// tslint:disable:quotemark
// tslint:disable:object-literal-sort-keys

class ManifestIcons {
    static configure(descriptor) {
        if (!descriptor.name.startsWith('assets/icons/')) {
            return descriptor;
        }
        descriptor.name = descriptor.name
            .split('/')
            .filter((e, i) => {
                return i !== 2;
            })
            .join('/');

        return descriptor;
    }
}

module.exports = ManifestIcons;
