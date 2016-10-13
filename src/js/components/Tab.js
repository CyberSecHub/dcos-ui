import React from 'react';

class Tab extends React.Component {
  render() {
    return this.props.children;
  }
}

Tab.propTypes = {
  children: React.PropTypes.node,
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.node.isRequired
};

module.exports = Tab;
