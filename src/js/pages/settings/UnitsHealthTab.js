import classNames from 'classnames';
import {Link} from 'react-router';
import mixin from 'reactjs-mixin';
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import {StoreMixin} from 'mesosphere-shared-reactjs';
import {Table} from 'reactjs-components';

import Config from '../../config/Config';
import FilterHeadline from '../../components/FilterHeadline';
import FilterButtons from '../../components/FilterButtons';
import FilterInputText from '../../components/FilterInputText';
import ResourceTableUtil from '../../utils/ResourceTableUtil';
import SidePanels from '../../components/SidePanels';
import StringUtil from '../../utils/StringUtil';
import TableUtil from '../../utils/TableUtil';
import UnitHealthStore from '../../stores/UnitHealthStore';
import UnitHealthUtil from '../../utils/UnitHealthUtil';

const METHODS_TO_BIND = [
  'handleHealthFilterChange',
  'handleSearchStringChange',
  'renderUnit',
  'renderHealth',
  'resetFilter'
];

class UnitsHealthTab extends mixin(StoreMixin) {

  constructor() {
    super(...arguments);

    this.store_listeners = [
      {
        name: 'unitHealth',
        events: ['success', 'error']
      }
    ];

    this.state = {
      healthFilter: 'all',
      searchString: ''
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    }, this);
  }

  componentDidMount() {
    super.componentDidMount();
    UnitHealthStore.fetchUnits();
  }

  handleSearchStringChange(searchString) {
    this.setState({searchString});
  }

  renderUnit(prop, unit) {
    return (
      <div className="text-overflow">
        <Link to="settings-system-units-unit-nodes-panel"
          params={{unitID: unit.get('unit_id')}}
          className="headline">
          <span className="icon icon-small icon-image-container icon-app-container">
            <img src="./img/services/icon-service-default-small@2x.png" />
          </span>
          {unit.get(prop)}
        </Link>
      </div>
    );
  }

  renderHealth(prop, unit) {
    let health = unit.getHealth();

    return (
      <span className={health.classNames}>
        {StringUtil.capitalize(health.title)}
      </span>
    );
  }

  getButtonContent(filterName, count) {
    let dotClassSet = classNames({
      'dot': filterName !== 'all',
      'danger': filterName === 'unhealthy',
      'success': filterName === 'healthy'
    });

    return (
      <span className="button-align-content">
        <span className={dotClassSet}></span>
        <span className="label">{StringUtil.capitalize(filterName)}</span>
        <span className="badge">{count || 0}</span>
      </span>
    );
  }

  getColGroup() {
    return (
      <colgroup>
        <col style={{width: '75%'}} />
        <col style={{width: '25%'}} />
      </colgroup>
    );
  }

  getColumns() {
    let classNameFn = ResourceTableUtil.getClassName;

    return [
      {
        cacheCell: true,
        className: classNameFn,
        headerClassName: classNameFn,
        prop: 'unit_title',
        render: this.renderUnit,
        sortable: true,
        sortFunction: ResourceTableUtil.getPropSortFunction('unit_title'),
        heading: ResourceTableUtil.renderHeading({unit_title: 'NAME'})
      },
      {
        className: classNameFn,
        headerClassName: classNameFn,
        prop: 'unit_health',
        render: this.renderHealth,
        sortable: true,
        sortFunction: ResourceTableUtil.getStatSortFunction(
          'unit_title',
          UnitHealthUtil.getHealthSorting
        ),
        heading: ResourceTableUtil.renderHeading({unit_health: 'HEALTH'})
      }
    ];
  }

  handleHealthFilterChange(healthFilter) {
    this.setState({healthFilter});
  }

  getVisibleData(data, searchString, healthFilter) {
    return data.filter({title: searchString, health: healthFilter}).getItems();
  }

  resetFilter() {
    this.setState({
      searchString: '',
      healthFilter: 'all'
    });
  }

  render() {
    let data = UnitHealthStore.getUnits();
    let dataItems = data.getItems();
    let {healthFilter, searchString} = this.state;
    let visibleData = this.getVisibleData(data, searchString, healthFilter);
    let pluralizedItemName = StringUtil.pluralize('Unit', dataItems.length);
    let dataHealth = dataItems.map(function (unit) {
      return unit.getHealth();
    });

    return (
      <div className="flex-container-col">
        <div className="units-health-table-header">
          <FilterHeadline
            inverseStyle={true}
            onReset={this.resetFilter}
            name={pluralizedItemName}
            currentLength={visibleData.length}
            totalLength={dataItems.length} />
          <div className="media-object-spacing-wrapper media-object-spacing-narrow">
            <div className="media-object media-object-wrap-reverse">
              <div className="media-object media-object-item media-object-inline media-object-wrap">
                <div className="media-object-item media-object-align-top">
                  <FilterButtons
                    renderButtonContent={this.getButtonContent}
                    filters={['all', 'healthy', 'unhealthy']}
                    filterByKey={'title'}
                    onFilterChange={this.handleHealthFilterChange}
                    itemList={dataHealth}
                    selectedFilter={healthFilter} />
                </div>
                <div className="media-object-item media-object-align-top">
                  <FilterInputText
                    searchString={searchString}
                    handleFilterChange={this.handleSearchStringChange}
                    inverseStyle={true} />
                </div>
              </div>
              <div className="media-object media-object-item media-object-inline media-object-item-align-right">
                <div className="media-object-item">
                  <a href={`${Config.rootUrl}${Config.unitHealthAPIPrefix}\/report`}
                    className="button button-primary">
                    Download Snapshot
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-content-fill flex-grow flex-container-col">
          <Table
            className="table inverse table-borderless-outer
              table-borderless-inner-columns flush-bottom"
            columns={this.getColumns()}
            colGroup={this.getColGroup()}
            containerSelector=".gm-scroll-view"
            data={visibleData}
            itemHeight={TableUtil.getRowHeight()}
            sortBy={{prop: 'unit_health', order: 'desc'}}
            />
        </div>
        <SidePanels
          params={this.props.params}
          openedPage="settings-system-units" />
      </div>
    );
  }
}

module.exports = UnitsHealthTab;