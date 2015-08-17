var _ = require("underscore");

var AppDispatcher = require("../events/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");
var EventTypes = require("../constants/EventTypes");
var InternalStorageMixin = require("../mixins/InternalStorageMixin");
var Stores = require("../utils/Stores");

var MetadataStore = Stores.createStore({

  init: function () {
    this.internalStorage_set({metadata: {}});
  },

  mixins: [InternalStorageMixin],

  get: function (key) {
    return this.internalStorage_get()[key];
  },

  set: function (data) {
    this.internalStorage_update(data);
  },

  emitChange: function (eventName) {
    this.emit(eventName);
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    var source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;

    switch (action.type) {
      case ActionTypes.REQUEST_METADATA:
        var oldMetadata = MetadataStore.get("metadata");
        var metadata = action.data;

        // only emitting on change
        if (!_.isEqual(oldMetadata, metadata)) {
          MetadataStore.set({metadata});
          MetadataStore.emitChange(EventTypes.METADATA_CHANGE);
        }
        break;
    }

    return true;
  })

});

module.exports = MetadataStore;
