var Dispatcher = require("flux").Dispatcher;
var _ = require("underscore");

var ActionTypes = require("../constants/ActionTypes");

var AppDispatcher = _.extend(new Dispatcher(), {

  handleServerAction: function (action) {
    if (!action.type) {
      console.warn("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch({
      source: ActionTypes.SERVER_ACTION,
      action: action
    });
  },

  handleSidebarAction: function (action) {
    if (!action.type) {
      console.warn("Empty action.type: you likely mistyped the action.");
    }

    this.dispatch({
      source: ActionTypes.SIDEBAR_ACTION,
      action: action
    });
  }
});

module.exports = AppDispatcher;
