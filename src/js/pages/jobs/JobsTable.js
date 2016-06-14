import classNames from 'classnames';
import {Link} from 'react-router';
import React from 'react';
import {Table} from 'reactjs-components';

import JobTableHeaderLabels from '../../constants/JobTableHeaderLables';
import ResourceTableUtil from '../../utils/ResourceTableUtil';
import TableUtil from '../../utils/TableUtil';
import Tree from '../../structs/Tree';

const METHODS_TO_BIND = [
  'renderHeadline'
];

class JobsTable extends React.Component {
  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getColGroup() {
    return (
      <colgroup>
        <col />
        <col style={{width: '20%'}} />
        <col style={{width: '20%'}} />
      </colgroup>
    );
  }

  getColumns() {
    let className = ResourceTableUtil.getClassName;
    let heading = ResourceTableUtil.renderHeading(JobTableHeaderLabels);

    return [
      {
        className,
        headerClassName: className,
        prop: 'name',
        render: this.renderHeadline,
        sortable: true,
        sortFunction: this.sortJobNames,
        heading
      }, {
        className,
        headerClassName: className,
        prop: 'status',
        render: this.renderStatusColumn,
        sortable: false,
        heading
      }, {
        className,
        headerClassName: className,
        prop: 'lastRunStatus',
        render: this.renderLastRunStatusColumn
      }
    ];
  }

  getData() {
    return this.props.jobs.map(function (job) {
      let isGroup = job instanceof Tree;
      let lastRunStatus = null;
      let status = null;

      if (!isGroup) {
        lastRunStatus = job.getLastRunStatus().status;
        status = job.getScheduleStatus();
      }

      return {
        id: job.getId(),
        isGroup,
        name: job.getName(),
        status,
        lastRunStatus
      };
    });
  }

  sortJobNames(prop, direction) {
    let score = 1;

    if (direction === 'desc') {
      score = -1;
    }

    return function (a, b) {
      // Hoist group trees to the top
      if (a.isGroup && !b.isGroup) {
        return score * -1;
      } else if (b.isGroup && !a.isGroup) {
        return score;
      }

      return a.name.localeCompare(b.name);
    };
  }

  renderHeadline(prop, job) {
    const id = encodeURIComponent(job.id);
    let itemImage = null;

    if (job.isGroup) {
      itemImage = (
        <span
          className="icon icon-small icon-image-container icon-app-container">
          <i className="icon icon-sprite icon-sprite-mini icon-directory "/>
        </span>
      );
    }

    return (
      <div className="job-table-heading flex-box
        flex-box-align-vertical-center table-cell-flex-box">
        <Link to="jobs-detail"
          className="table-cell-icon"
          params={{id}}>
          {itemImage}
        </Link>
        <Link to="jobs-detail"
          className="headline table-cell-value flex-box flex-box-col"
          params={{id}}>
          <span className="text-overflow">
            {job.name}
          </span>
        </Link>
      </div>
    );
  }

  renderLastRunStatusColumn(prop, row) {
    let value = row[prop];
    let statusClasses = classNames({
      'text-success': value === 'Success',
      'text-danger': value === 'Failed'
    });

    return <span className={statusClasses}>{value}</span>;
  }

  renderStatusColumn(prop, row) {
    let value = row[prop];
    let statusClasses = classNames({
      'text-muted': value === 'completed',
      'text-color-white': value !== 'completed'
    });
    let statusText = null;

    if (value === 'active') {
      statusText = 'Running';
    } else if (value === 'scheduled') {
      statusText = 'Scheduled';
    } else if (value === 'completed') {
      statusText = 'Completed';
    }

    return <span className={statusClasses}>{statusText}</span>;
  }

  render() {
    return (
      <Table
        className="table inverse table-borderless-outer table-borderless-inner-columns flush-bottom"
        colGroup={this.getColGroup()}
        columns={this.getColumns()}
        data={this.getData()}
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{prop: 'name', order: 'asc'}} />
    );
  }
}

JobsTable.propTypes = {
  jobs: React.PropTypes.array.isRequired
};

module.exports = JobsTable;
