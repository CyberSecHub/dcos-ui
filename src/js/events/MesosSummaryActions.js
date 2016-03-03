import ActionTypes from '../constants/ActionTypes';
var AppDispatcher = require('./AppDispatcher');
var Config = require('../config/Config');
import PluginSDK from 'PluginSDK';
var RequestUtil = require('../utils/RequestUtil');
var _historyServiceOnline = true;

var Actions = PluginSDK.getActions('Tracking', false);

function getStateUrl(timeScale) {
  timeScale = timeScale || 'last';
  if (_historyServiceOnline) {
    return `${Config.historyServer}/dcos-history-service/history/${timeScale}`;
  } else {
    return `${Config.rootUrl}/mesos/master/state-summary`;
  }
}

function registerServerError(message, type) {
  _historyServiceOnline = false;
  if (Actions) {
    Actions.log({
      eventID: 'Server error',
      type: type,
      error: message
    });
  }
}

var MesosSummaryActions = {

  fetchSummary: RequestUtil.debounceOnError(
    Config.getRefreshRate(),
    function (resolve, reject) {
      return function (timeScale) {
        var successAction = ActionTypes.REQUEST_MESOS_HISTORY_SUCCESS;
        var errorAction = ActionTypes.REQUEST_MESOS_HISTORY_ERROR;
        var hangingRequestAction = ActionTypes.REQUEST_MESOS_HISTORY_ONGOING;

        if (timeScale == null) {
          successAction = ActionTypes.REQUEST_MESOS_SUMMARY_SUCCESS;
          errorAction = ActionTypes.REQUEST_MESOS_SUMMARY_ERROR;
          hangingRequestAction = ActionTypes.REQUEST_MESOS_SUMMARY_ONGOING;
        }

        var url = getStateUrl(timeScale);

        RequestUtil.json({
          url: url,
          success: function (response) {
            AppDispatcher.handleServerAction({
              type: successAction,
              data: response
            });
            resolve();
          },
          error: function (e) {
            registerServerError(e.message, errorAction);
            AppDispatcher.handleServerAction({
              type: errorAction,
              data: e.message
            });
            reject();
          },
          hangingRequestCallback: function () {
            AppDispatcher.handleServerAction({type: hangingRequestAction});
          }
        });
      };
    },
    {delayAfterCount: Config.delayAfterErrorCount}
  )

};

module.exports = MesosSummaryActions;
