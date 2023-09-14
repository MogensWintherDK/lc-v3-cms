const path = require('path');

module.exports = {
    // Is added here to prevent two instances of react to be used, one from the project
    // here and one from the node_modules npm package. It results in useEffect/useState
    // and more will fail if used in the npm package
    webpack: (config, options) => {
        if (options.isServer) {
            config.externals = ['react', ...config.externals];
        }
        config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');
        return config;
    },
}