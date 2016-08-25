let ActionTypes = {};
[
  'REQUEST_CLI_INSTRUCTIONS',
  'REQUEST_CLUSTER_CCID_ERROR',
  'REQUEST_CLUSTER_CCID_SUCCESS',
  'REQUEST_CONFIG_ERROR',
  'REQUEST_CONFIG_SUCCESS',
  'REQUEST_COSMOS_PACKAGE_DESCRIBE_ERROR',
  'REQUEST_COSMOS_PACKAGE_DESCRIBE_SUCCESS',
  'REQUEST_COSMOS_PACKAGE_INSTALL_ERROR',
  'REQUEST_COSMOS_PACKAGE_INSTALL_SUCCESS',
  'REQUEST_COSMOS_PACKAGE_UNINSTALL_ERROR',
  'REQUEST_COSMOS_PACKAGE_UNINSTALL_SUCCESS',
  'REQUEST_COSMOS_PACKAGES_LIST_ERROR',
  'REQUEST_COSMOS_PACKAGES_LIST_SUCCESS',
  'REQUEST_COSMOS_PACKAGES_SEARCH_ERROR',
  'REQUEST_COSMOS_PACKAGES_SEARCH_SUCCESS',
  'REQUEST_COSMOS_REPOSITORIES_LIST_ERROR',
  'REQUEST_COSMOS_REPOSITORIES_LIST_SUCCESS',
  'REQUEST_COSMOS_REPOSITORY_ADD_ERROR',
  'REQUEST_COSMOS_REPOSITORY_ADD_SUCCESS',
  'REQUEST_COSMOS_REPOSITORY_DELETE_ERROR',
  'REQUEST_COSMOS_REPOSITORY_DELETE_SUCCESS',
  'REQUEST_DCOS_METADATA',
  'REQUEST_HEALTH_NODE_ERROR',
  'REQUEST_HEALTH_NODE_SUCCESS',
  'REQUEST_HEALTH_NODE_UNIT_ERROR',
  'REQUEST_HEALTH_NODE_UNIT_SUCCESS',
  'REQUEST_HEALTH_NODE_UNITS_ERROR',
  'REQUEST_HEALTH_NODE_UNITS_SUCCESS',
  'REQUEST_HEALTH_NODES_ERROR',
  'REQUEST_HEALTH_NODES_SUCCESS',
  'REQUEST_HEALTH_UNIT_ERROR',
  'REQUEST_HEALTH_UNIT_NODE_ERROR',
  'REQUEST_HEALTH_UNIT_NODE_SUCCESS',
  'REQUEST_HEALTH_UNIT_NODES_ERROR',
  'REQUEST_HEALTH_UNIT_NODES_SUCCESS',
  'REQUEST_HEALTH_UNIT_SUCCESS',
  'REQUEST_HEALTH_UNITS_ERROR',
  'REQUEST_HEALTH_UNITS_SUCCESS',
  'REQUEST_LOGIN_ERROR',
  'REQUEST_LOGIN_SUCCESS',
  'REQUEST_LOGOUT_ERROR',
  'REQUEST_LOGOUT_SUCCESS',
  'REQUEST_MESOS_STATE_ERROR',
  'REQUEST_MESOS_STATE_ONGOING',
  'REQUEST_MESOS_STATE_SUCCESS',
  'REQUEST_METADATA',
  'REQUEST_METRONOME_JOB_CREATE_ERROR',
  'REQUEST_METRONOME_JOB_CREATE_SUCCESS',
  'REQUEST_METRONOME_JOB_DELETE_ERROR',
  'REQUEST_METRONOME_JOB_DELETE_SUCCESS',
  'REQUEST_METRONOME_JOB_DETAIL_ERROR',
  'REQUEST_METRONOME_JOB_DETAIL_ONGOING',
  'REQUEST_METRONOME_JOB_DETAIL_SUCCESS',
  'REQUEST_METRONOME_JOB_RUN_ERROR',
  'REQUEST_METRONOME_JOB_RUN_SUCCESS',
  'REQUEST_METRONOME_JOB_SCHEDULE_UPDATE_ERROR',
  'REQUEST_METRONOME_JOB_SCHEDULE_UPDATE_SUCCESS',
  'REQUEST_METRONOME_JOB_STOP_RUN_ERROR',
  'REQUEST_METRONOME_JOB_STOP_RUN_SUCCESS',
  'REQUEST_METRONOME_JOB_UPDATE_ERROR',
  'REQUEST_METRONOME_JOB_UPDATE_SUCCESS',
  'REQUEST_METRONOME_JOBS_ERROR',
  'REQUEST_METRONOME_JOBS_ONGOING',
  'REQUEST_METRONOME_JOBS_SUCCESS',
  'REQUEST_SIDEBAR_CLOSE',
  'REQUEST_SIDEBAR_CLOSE',
  'REQUEST_SIDEBAR_OPEN',
  'REQUEST_SIDEBAR_OPEN',
  'REQUEST_SIDEBAR_WIDTH_CHANGE',
  'REQUEST_SUMMARY_ERROR',
  'REQUEST_SUMMARY_HISTORY_ONGOING',
  'REQUEST_SUMMARY_HISTORY_SUCCESS',
  'REQUEST_SUMMARY_ONGOING',
  'REQUEST_SUMMARY_SUCCESS',
  'REQUEST_USER_CREATE_ERROR',
  'REQUEST_USER_CREATE_SUCCESS',
  'REQUEST_USER_DELETE_ERROR',
  'REQUEST_USER_DELETE_SUCCESS',
  'REQUEST_USERS_ERROR',
  'REQUEST_USERS_SUCCESS',
  'REQUEST_VERSIONS_ERROR',
  'REQUEST_VERSIONS_SUCCESS',
  'REQUEST_VIRTUAL_NETWORKS_ERROR',
  'REQUEST_VIRTUAL_NETWORKS_SUCCESS',
  'SERVER_ACTION',
  'SIDEBAR_ACTION'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;
