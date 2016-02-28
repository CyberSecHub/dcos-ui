import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import AppDispatcher from '../events/AppDispatcher';
import CosmosPackagesActions from '../events/CosmosPackagesActions';
import {
  COSMOS_SEARCH_CHANGE,
  COSMOS_SEARCH_ERROR,
  COSMOS_LIST_CHANGE,
  COSMOS_LIST_ERROR,
  COSMOS_DESCRIBE_CHANGE,
  COSMOS_DESCRIBE_ERROR,
  COSMOS_INSTALL_SUCCESS,
  COSMOS_INSTALL_ERROR,
  COSMOS_UNINSTALL_SUCCESS,
  COSMOS_UNINSTALL_ERROR
} from '../constants/EventTypes';
import {
  REQUEST_COSMOS_PACKAGES_LIST_ERROR,
  REQUEST_COSMOS_PACKAGES_LIST_SUCCESS,
  REQUEST_COSMOS_PACKAGES_SEARCH_ERROR,
  REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR,
  REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS,
  REQUEST_COSMOS_PACKAGE_INSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR,
  REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS,
  SERVER_ACTION
} from '../constants/ActionTypes';
import UniverseInstalledPackagesList from
  '../structs/UniverseInstalledPackagesList';
import UniversePackage from '../structs/UniversePackage';
import UniversePackagesList from '../structs/UniversePackagesList';

const CosmosPackagesStore = Store.createStore({
  storeID: 'cosmosPackages',

  mixins: [GetSetMixin],

  getSet_data: {
    availablePackages: [],
    packageDetails: null,
    installedPackages: []
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  /* API */
  fetchAvailablePackages: CosmosPackagesActions.fetchAvailablePackages,

  fetchInstalledPackages: CosmosPackagesActions.fetchInstalledPackages,

  fetchPackageDescription: CosmosPackagesActions.fetchPackageDescription,

  installPackage: CosmosPackagesActions.installPackage,

  uninstallPackage: CosmosPackagesActions.uninstallPackage,

  /* Reducers */
  getAvailablePackages() {
    return new UniversePackagesList({items: this.get('availablePackages')});
  },

  getInstalledPackages() {
    return new UniverseInstalledPackagesList(
      {items: this.get('installedPackages')}
    );
  },

  getPackageDetails() {
    let packageDetails = this.get('packageDetails');
    if (packageDetails) {
      return new UniversePackage(packageDetails);
    }

    return null;
  },

  processAvailablePackagesSuccess: function (packages, query) {
    this.set({availablePackages: packages});

    this.emit(COSMOS_SEARCH_CHANGE, query);
  },

  processAvailablePackagesError: function (error, query) {
    this.emit(COSMOS_SEARCH_ERROR, error, query);
  },

  processInstalledPackagesSuccess: function (packages, name, appId) {
    this.set({installedPackages: packages});

    this.emit(COSMOS_LIST_CHANGE, name, appId);
  },

  processInstalledPackagesError: function (error, name, appId) {
    this.emit(COSMOS_LIST_ERROR, error, name, appId);
  },

  processPackageDescriptionSuccess: function (cosmosPackage, name, version) {
    this.set({packageDetails: cosmosPackage});

    this.emit(COSMOS_DESCRIBE_CHANGE, name, version);
  },

  processPackageDescriptionError: function (error, name, version) {
    this.set({packageDetails: null});

    this.emit(COSMOS_DESCRIBE_ERROR, error, name, version);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== SERVER_ACTION) {
      return false;
    }

    let action = payload.action;
    let data = action.data;

    switch (action.type) {
      case REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS:
        CosmosPackagesStore.processPackageDescriptionSuccess(
          data,
          action.packageName,
          action.packageVersion
        );
        break;
      case REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR:
        CosmosPackagesStore.processPackageDescriptionError(
          data,
          action.packageName,
          action.packageVersion
        );
        break;
      case REQUEST_COSMOS_PACKAGES_LIST_SUCCESS:
        CosmosPackagesStore.processInstalledPackagesSuccess(
          data,
          action.packageName,
          action.appId
        );
        break;
      case REQUEST_COSMOS_PACKAGES_LIST_ERROR:
        CosmosPackagesStore.processInstalledPackagesError(
          data,
          action.packageName,
          action.appId
        );
        break;
      case REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS:
        CosmosPackagesStore.processAvailablePackagesSuccess(data, action.query);
        break;
      case REQUEST_COSMOS_PACKAGES_SEARCH_ERROR:
        CosmosPackagesStore.processAvailablePackagesError(data, action.query);
        break;
      case REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS:
        CosmosPackagesStore.emit(
          COSMOS_INSTALL_SUCCESS,
          action.packageName,
          action.packageVersion
        );
        break;
      case REQUEST_COSMOS_PACKAGE_INSTALL_ERROR:
        CosmosPackagesStore.emit(
          COSMOS_INSTALL_ERROR,
          data,
          action.packageName,
          action.packageVersion
        );
        break;
      case REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS:
        CosmosPackagesStore.emit(
          COSMOS_UNINSTALL_SUCCESS,
          action.packageName,
          action.packageVersion,
          action.appId
        );
        break;
      case REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR:
        CosmosPackagesStore.emit(
          COSMOS_UNINSTALL_ERROR,
          data,
          action.packageName,
          action.packageVersion,
          action.appId
        );
        break;
    }

    return true;
  })

});

module.exports = CosmosPackagesStore;
