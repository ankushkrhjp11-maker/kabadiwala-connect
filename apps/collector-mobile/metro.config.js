const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  '@kabadiwala/types': path.resolve(workspaceRoot, 'packages/types/src'),
  '@kabadiwala/i18n': path.resolve(workspaceRoot, 'packages/i18n/src'),
};

module.exports = config;
