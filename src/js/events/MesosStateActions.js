var ActionTypes = require("../constants/ActionTypes");
var AppDispatcher = require("./AppDispatcher");
var Config = require("../config/Config");
var RequestUtil = require("../utils/RequestUtil");

var MesosStateActions = {

  fetchState: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function () {
        RequestUtil.json({
          url: `${Config.historyServer}/mesos/master/state.json`,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MESOS_STATE_SUCCESS,
              data: response
            });
            resolve();
          },
          error: function (e) {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MESOS_STATE_ERROR,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({
              type: ActionTypes.REQUEST_MESOS_STATE_ONGOING
            });
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  )

};

module.exports = MesosStateActions;
