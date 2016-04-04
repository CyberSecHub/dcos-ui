import _ from 'underscore';
import React from 'react';

import EventTypes from '../constants/EventTypes';
import FilterByTaskState from './FilterByTaskState';
import FilterInputText from './FilterInputText';
import MesosStateStore from '../stores/MesosStateStore';
import RequestErrorMsg from './RequestErrorMsg';
import StringUtil from '../utils/StringUtil';
import TaskStates from '../constants/TaskStates';
import TaskTable from './TaskTable';
import UserSettingsStore from '../stores/UserSettingsStore';

const METHODS_TO_BIND = [
  'handleSearchStringChange',
  'handleStatusFilterChange',
  'onMesosStateRequestError'
];

class TaskView extends React.Component {
  get savedStateKey() {
    let location = global.window.location.hash;
    return `taskView${location}`;
  }

  constructor() {
    super();

    this.state = {
      mesosStateErrorCount: 0,
      searchString: '',
      filterByStatus: 'all'
    };

    METHODS_TO_BIND.forEach(function (method) {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentWillMount() {
    let savedState = UserSettingsStore.getSavedState(this.savedStateKey);
    this.setState(savedState);

    MesosStateStore.addChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  }

  componentWillUnmount() {
    UserSettingsStore.setSavedState(this.savedStateKey, this.state);

    MesosStateStore.removeChangeListener(
      EventTypes.MESOS_STATE_REQUEST_ERROR,
      this.onMesosStateRequestError
    );
  }

  onMesosStateRequestError() {
    this.setState({mesosStateErrorCount: this.state.mesosStateErrorCount + 1});
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  handleStatusFilterChange(filterByStatus) {
    this.setState({filterByStatus});
  }

  filterByCurrentStatus(tasks) {
    let status = this.state.filterByStatus;
    if (status === 'all') {
      return tasks;
    }

    return _.filter(tasks, function (task) {
      return _.contains(TaskStates[task.state].stateTypes, status);
    });
  }

  hasLoadingError() {
    return this.state.mesosStateErrorCount >= 3;
  }


  getStatusCounts(tasks) {
    let statusCount = {active: 0, completed: 0};

    tasks.forEach(function (task) {
      if (_.contains(TaskStates[task.state].stateTypes, 'active')) {
        statusCount.active += 1;
      }

      if (_.contains(TaskStates[task.state].stateTypes, 'completed')) {
        statusCount.completed += 1;
      }
    });

    return statusCount;
  }

  getStatuses(tasks) {
    let statusCount = this.getStatusCounts(tasks);
    return [{
      count: statusCount.active,
      id: 'active',
      name: 'Active Tasks',
      value: 'active'
    }, {
      count: statusCount.completed,
      id: 'completed',
      name: 'Completed Tasks',
      value: 'completed'
    }];
  }

  getLoadingScreen() {
    if (this.hasLoadingError()) {
      return <RequestErrorMsg />;
    }

    return (
      <div className="
        container
        container-pod
        text-align-center
        vertical-center
        inverse">
        <div className="row">
          <div className="ball-scale">
            <div />
          </div>
        </div>
      </div>
    );
  }

  getTaskTable(tasks) {
    return (
      <TaskTable tasks={tasks} parentRouter={this.props.parentRouter} />
    );
  }

  getHeaderText(tasks) {
    let currentStatus = this.state.filterByStatus;
    let tasksLength = tasks.length;
    if (currentStatus === 'all') {
      return `${tasksLength} ${StringUtil.pluralize('Task', tasksLength)}`;
    }

    const displayNameMap = {
      active: 'Active',
      completed: 'Completed'
    };

    let statusCount = this.getStatusCounts(tasks)[currentStatus];
    let displayName = displayNameMap[currentStatus];
    let pluralizedTasks = StringUtil.pluralize('Task', statusCount);
    return `${statusCount} ${displayName} ${pluralizedTasks}`;
  }

  getContent() {
    let state = this.state;
    let tasks = this.props.tasks || [];

    if (state.searchString !== '') {
      tasks = StringUtil.filterByString(tasks, 'name', state.searchString);
    }

    tasks = this.filterByCurrentStatus(tasks);

    return (
      <div className="flex-container-col flex-grow">
        <span className="h4 text-align-left flush-top">
          {this.getHeaderText(tasks)}
        </span>
        <div className="flex-box control-group">
          <FilterInputText
            searchString={state.searchString}
            handleFilterChange={this.handleSearchStringChange}
            inverseStyle={false} />
          <div>
            <FilterByTaskState
              statuses={this.getStatuses(tasks)}
              handleFilterChange={this.handleStatusFilterChange}
              totalTasksCount={tasks.length}
              currentStatus={state.filterByStatus}/>
          </div>
        </div>
        {this.getTaskTable(tasks)}
      </div>
    );
  }

  render() {
    var showLoading = this.hasLoadingError() ||
      Object.keys(MesosStateStore.get('lastMesosState')).length === 0;

    if (showLoading) {
      return this.getLoadingScreen();
    } else {
      return this.getContent();
    }
  }
}

TaskView.propTypes = {
  tasks: React.PropTypes.array
};

module.exports = TaskView;
