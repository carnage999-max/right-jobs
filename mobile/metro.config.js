const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable symlinks for pnpm support
config.resolver.unstable_enableSymlinks = true;
// Enable package exports for newer packages
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
