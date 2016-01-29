import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';
import RequestUtil from '../utils/RequestUtil';

const MesosLogActions = {

  requestOffset: function (slaveID, path) {
    RequestUtil.json({
      url: `${Config.rootUrl}/slave/${slaveID}/files/read.json?path=${path}&offset=-1`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MESOS_LOG_OFFSET_SUCCESS,
          data: response,
          path,
          slaveID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MESOS_LOG_OFFSET_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          path,
          slaveID
        });
      }
    });
  },

  fetchLog: function (slaveID, path, offset, length) {
    RequestUtil.json({
      url: `${Config.rootUrl}/slave/${slaveID}/files/read.json?path=${path}&offset=${offset}&length=${length}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MESOS_LOG_SUCCESS,
          data: response,
          path,
          slaveID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MESOS_LOG_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          path,
          slaveID
        });
      }
    });
  },

  fetchPreviousLog: function (slaveID, path, offset, length) {
    RequestUtil.json({
      url: `${Config.rootUrl}/slave/${slaveID}/files/read.json?path=${path}&offset=${offset}&length=${length}`,
      success: function (response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_PREVIOUS_MESOS_LOG_SUCCESS,
          data: response,
          path,
          slaveID
        });
      },
      error: function (xhr) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_MESOS_LOG_ERROR,
          data: RequestUtil.getErrorFromXHR(xhr),
          path,
          slaveID
        });
      }
    });
  }

};

export default MesosLogActions;
