import SDK from './SDK';

module.exports = function (PluginSDK) {
  SDK.setSDK(PluginSDK);

  let PluginHooks = require('./hooks');
  let StoreConfig = require('./storeConfig');

  // Set plugin's hooks
  PluginHooks.initialize();
  // Register our Stores
  StoreConfig.register();
};