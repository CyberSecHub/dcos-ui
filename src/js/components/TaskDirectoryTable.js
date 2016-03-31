import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';
import {Table} from 'reactjs-components';

import DateUtil from '../utils/DateUtil';
import ResourceTableUtil from '../utils/ResourceTableUtil';
import TaskDirectoryHeaderLabels from '../constants/TaskDirectoryHeaderLabels';
import TaskDirectoryActions from '../events/TaskDirectoryActions';
import Units from '../utils/Units';

function renderByProperty(prop, directoryItem) {
  return directoryItem.get(prop);
}

class TaskDirectoryTable extends React.Component {
  handleTaskClick(path) {
    this.props.onFileClick(path);
  }

  renderHeadline(prop, directoryItem) {
    let label;
    let {nodeID} = this.props;
    let filePath = directoryItem.get('path');
    let value = directoryItem.getName();

    if (directoryItem.isDirectory()) {
      label = (
        <a
          className="emphasize clickable"
          onClick={this.handleTaskClick.bind(this, value)}>
          {value}
        </a>
      );
    } else {
      label = (
        <a
          className="emphasize"
          href={TaskDirectoryActions.getDownloadURL(nodeID, filePath)}>
          {value}
        </a>
      );
    }

    let iconClass = classNames({
      'icon icon-sprite icon-sprite-mini': true,
      'icon-file': !directoryItem.isDirectory(),
      'icon-directory': directoryItem.isDirectory()
    });

    let openLogView;
    if (directoryItem.isLogFile()) {
      openLogView = (
        <div
          className="table-cell-icon table-cell-icon-mini table-display-on-row-hover fade-in-on-hover clickable"
          onClick={this.props.onOpenLogClick.bind(this, directoryItem, this.props.directoryPath)}>
          <i
            className="icon icon-sprite icon-sprite-mini icon-search icon-align-right" />
        </div>
      );
    }

    return (
      <div className="flex-box flex-box-align-vertical-center table-cell-flex-box">
        <div className="table-cell-icon table-cell-icon-mini">
          <i className={iconClass}></i>
        </div>
        <span title={value} className="table-cell-value text-overflow">
          {label}
        </span>
        {openLogView}
      </div>
    );
  }

  renderStats(prop, directoryItem) {
    return (
      <span>
        {Units.filesize(directoryItem.get(prop), 1)}
      </span>
    );
  }

  renderDate(prop, directoryItem) {
    return (
      <span title={DateUtil.msToDateStr(directoryItem.get(prop) * 1000)}>
        {DateUtil.msToRelativeTime(directoryItem.get(prop))}
      </span>
    );
  }

  getClassName(prop, sortBy, row) {
    let isHeader = row == null;
    let propsToRight = ['uid', 'size', 'mtime'];

    return classNames({
      'text-align-right': _.contains(propsToRight, prop),
      'highlight': prop === sortBy.prop && isHeader,
      'clickable': isHeader
    });
  }

  getDirectorySortFunction(baseProp, sortFunc) {
    return function (prop, order) {
      return function (a, b) {
        let aIsDirectory = a.isDirectory();
        let bIsDirectory = b.isDirectory();

        if (aIsDirectory && !bIsDirectory) {
          if (order === 'desc') {
            return 1;
          }

          return -1;
        }

        if (!aIsDirectory && bIsDirectory) {
          if (order === 'desc') {
            return -1;
          }

          return 1;
        }

        return sortFunc(prop)(a, b);
      };
    };
  }

  getColumns() {
    let className = this.getClassName;
    let heading = ResourceTableUtil.renderHeading(TaskDirectoryHeaderLabels);
    let propSortFunction = ResourceTableUtil.getPropSortFunction('path');
    let statSortFunction = ResourceTableUtil.getStatSortFunction(
      'path',
      function (directoryItem, resource) {
        return directoryItem.get(resource);
      }
    );

    propSortFunction = this.getDirectorySortFunction('path', propSortFunction);
    statSortFunction = this.getDirectorySortFunction('path', statSortFunction);

    let defaultColumnSettings = {
      className,
      heading,
      headerClassName: className,
      render: null,
      sortable: true,
      sortFunction: propSortFunction
    };

    return [
      {
        prop: 'path',
        render: this.renderHeadline.bind(this)
      },
      {
        prop: 'mode',
        render: renderByProperty
      },
      {
        prop: 'uid',
        render: renderByProperty
      },
      {
        prop: 'size',
        render: this.renderStats,
        sortFunction: statSortFunction
      },
      {
        cacheCell: true,
        prop: 'mtime',
        render: this.renderDate,
        sortFunction: statSortFunction
      }
    ].map(function (columnSetting) {
      return _.extend({}, defaultColumnSettings, columnSetting);
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: '150px'}}/>
        <col style={{width: '110px'}}/>
        <col style={{width: '100px'}}/>
        <col style={{width: '125px'}}/>
      </colgroup>
    );
  }

  render() {
    return (
      <Table
        className="table table-borderless-outer table-borderless-inner-columns flush-bottom"
        colGroup={this.getColGroup()}
        columns={this.getColumns()}
        containerSelector=".gm-scroll-view"
        data={this.props.files}
        sortBy={{prop: 'path', order: 'desc'}}
        transition={false} />
    );
  }
}

TaskDirectoryTable.defaultProps = {
  onOpenLogClick: function () {},
  files: []
};

TaskDirectoryTable.propTypes = {
  directoryPath: React.PropTypes.string,
  onOpenLogClick: React.PropTypes.func,
  files: React.PropTypes.array
};

module.exports = TaskDirectoryTable;
