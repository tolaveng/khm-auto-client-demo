const electronConfigs = require('./webpack.electron.js');
const reactConfigs = require('./webpack.react.js');

module.exports = [
  reactConfigs,
  electronConfigs,
];