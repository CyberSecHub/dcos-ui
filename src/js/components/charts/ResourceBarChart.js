const _ = require("underscore");
const classNames = require("classnames");
const React = require("react/addons");

const BarChart = require("./BarChart");
const Chart = require("./Chart");
const InternalStorageMixin = require("../../mixins/InternalStorageMixin");
const ResourceTypes = require("../../constants/ResourceTypes");

// number to fit design of width vs. height ratio
const WIDTH_HEIGHT_RATIO = 4.5;

let ResourceBarChart = React.createClass({

  displayName: "ResourceBarChart",

  mixins: [InternalStorageMixin],

  propTypes: {
    onResourceSelectionChange: React.PropTypes.func.isRequired,
    itemCount: React.PropTypes.number.isRequired,
    resources: React.PropTypes.object.isRequired,
    refreshRate: React.PropTypes.number.isRequired,
    resourceType: React.PropTypes.string,
    selectedResource: React.PropTypes.string.isRequired,
    totalResources: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      itemCount: 0,
      totalResources: {},
      y: "percentage",
      refreshRate: 0,
      resourceType: ""
    };
  },

  getData: function () {
    let props = this.props;

    if (props.itemCount === 0) {
      return [];
    }

    let selectedResource = props.selectedResource;
    return [{
        id: "used_resources",
        name: selectedResource + " allocated",
        colorIndex: ResourceTypes[selectedResource].colorIndex,
        values: props.resources[selectedResource]
    }];
  },

  getMaxY: function () {
    let props = this.props;
    return _.last(props.totalResources[this.props.selectedResource])[props.y];
  },

  handleSelectedResourceChange: function (selectedResource) {
    this.props.onResourceSelectionChange(selectedResource);
  },

  getModeButtons: function () {
    let selectedResource = this.props.selectedResource;

    return _.map(ResourceTypes, function (info, key) {
      let classSet = classNames({
        "button button-small button-stroke button-inverse": true,
        "active": selectedResource === key
      });

      return (
        <button
            key={key}
            className={classSet + " path-color-" + info.colorIndex}
            onClick={this.handleSelectedResourceChange.bind(this, key)}>
          {info.label}
        </button>
      );
    }, this);
  },

  getBarChart: function () {
    return (
      <Chart calcHeight={function (w) { return w / WIDTH_HEIGHT_RATIO; }}>
        <BarChart
          data={this.getData()}
          maxY={this.getMaxY()}
          ticksY={4}
          y={this.props.y}
          refreshRate={this.props.refreshRate} />
      </Chart>
    );
  },

  getHeadline: function (info) {
    let headline = info.label + " Allocation Rate";

    return (
      <div>
        <h3 className="flush-top flush-bottom">
          {headline}
        </h3>
        <p className="flush-bottom">
          {this.props.itemCount + " Total " + this.props.resourceType}
        </p>
      </div>
    );
  },

  render: function () {
    let info = ResourceTypes[this.props.selectedResource];

    return (
      <div className="chart panel">
        <div className="panel-heading panel-heading-large">
          <div className="panel-options-left button-group">
            {this.getModeButtons()}
          </div>
          <div className="panel-title">
            {this.getHeadline(info)}
          </div>
          <div className="panel-options-right fixed-width">
          </div>
        </div>
        <div className="panel-content" ref="panelContent">
          {this.getBarChart()}
        </div>
      </div>
    );
  }
});

module.exports = ResourceBarChart;
