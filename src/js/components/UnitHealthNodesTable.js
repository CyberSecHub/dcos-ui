import React from 'react';
import {Table} from 'reactjs-components';

import ResourceTableUtil from '../utils/ResourceTableUtil';
import StringUtil from '../utils/StringUtil';
import TableUtil from '../utils/TableUtil';
import UnitHealthUtil from '../utils/UnitHealthUtil';

const METHODS_TO_BIND = [
  'renderHealth',
  'renderNode',
  'renderNodeRole'
];

class UnitHealthNodesTable extends React.Component {

  constructor() {
    super();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '25%'}} />
        <col />
        <col style={{width: '25%'}} />
      </colgroup>
    );
  }

  getColumns() {
    let classNameFn = ResourceTableUtil.getClassName;
    let headings = ResourceTableUtil.renderHeading({
      health: 'HEALTH',
      host_ip: 'NODE',
      role: 'ROLE'
    });

    return [
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: headings,
        prop: 'health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: ResourceTableUtil.getStatSortFunction(
          'host_ip',
          UnitHealthUtil.getHealthSorting
        )
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: headings,
        prop: 'host_ip',
        render: this.renderNode,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction()
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        heading: headings,
        prop: 'role',
        render: this.renderNodeRole,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('host_ip')
      }
    ];
  }

  getNodeLink(node, linkText) {
    let path = 'settings-system-units-unit-nodes-node-panel';
    let params = {unitID: this.props.itemID, unitNodeID: node.get('host_ip')};

    return (
      <a
        className="emphasize clickable text-overflow"
        onClick={() => { this.props.parentRouter.transitionTo(path, params); }}
        title={linkText}>
        {linkText}
      </a>
    );
  }

  renderHealth(prop, node) {
    let health = node.getHealth();

    return (
      <span className={health.classNames}>
        {StringUtil.capitalize(health.title)}
      </span>
    );
  }

  renderNode(prop, node) {
    return this.getNodeLink(node, node.get(prop));
  }

  renderNodeRole(prop, node) {
    return (
      StringUtil.capitalize(node.get(prop))
    );
  }

  render() {
    return (
      <Table
        className="table table-borderless-outer
          table-borderless-inner-columns flush-bottom"
        columns={this.getColumns()}
        colGroup={this.getColGroup()}
        containerSelector=".gm-scroll-view"
        data={this.props.nodes}
        idAttribute="id"
        itemHeight={TableUtil.getRowHeight()}
        sortBy={{prop: 'health', order: 'desc'}}
        />
    );
  }
}

UnitHealthNodesTable.propTypes = {
  nodes: React.PropTypes.array.isRequired
};

module.exports = UnitHealthNodesTable;
