/** @jsx React.DOM */

var d3 = require("d3");
var React = require("react/addons");

var TimeSeriesArea = React.createClass({

  displayName: "TimeSeriesArea",

  propTypes: {
    className: React.PropTypes.string,
    path: React.PropTypes.string.isRequired,
    line: React.PropTypes.string.isRequired,
    transitionTime: React.PropTypes.number.isRequired,
    position: React.PropTypes.array.isRequired
  },

  componentDidMount: function () {
    var props = this.props;

    d3.select(this.getDOMNode())
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");
  },

  componentWillReceiveProps: function (props) {
    d3.select(this.getDOMNode()).interrupt()
      .attr("transform", null)
      .transition()
      .duration(props.transitionTime)
      .ease("linear")
      .attr("transform", "translate(" + props.position + ")");
  },

  render: function () {
    return (
      <g>
        <path className={"area " + this.props.className} d={this.props.path} />
        <path className={"line " + this.props.className} d={this.props.line} />
      </g>
    );
  }
});

module.exports = TimeSeriesArea;
