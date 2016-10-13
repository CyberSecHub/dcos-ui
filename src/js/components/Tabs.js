import classNames from 'classnames/dedupe';
import React from 'react';

class Tabs extends React.Component {
  constructor(props = {}) {
    super();

    this.state = {
      activeTabIDs: props.activeTabIDs || []
    };
  }

  handleTabClick(tab, tabPath, event) {
    event.stopPropagation();
    this.setState({activeTabIDs: tabPath});

    if (this.props.onTabClick) {
      this.props.onTabClick(tab);
    }
  }

  getTabContent(children) {
    let {props, state} = this;
    let activeTabIDs = null;
    let content = null;

    // Descendent tabs get their activeTabIDs from their parent, while the
    // top-most Tabs component maintains state and propagates accordingly.
    if (props.isDescendent) {
      activeTabIDs = props.activeTabIDs;
    } else {
      activeTabIDs = state.activeTabIDs;
    }

    // A descendent tab is selected when activeTabIDs contains more than one
    // item.
    let isDescendentTabSelected = activeTabIDs.length > 1;

    // We need to iterate over the child Tab to determine which content to
    // render.
    React.Children.forEach(children, (tab, index) => {
      // We'll render the tab's content if it's a descendent of a selected tab,
      // or if it is the selected tab. If no tab is selected, then we render the
      // very first tab's content.
      if (activeTabIDs[0] === tab.props.id
        || (activeTabIDs.length === 0 && index === 0)) {
        content = React.Children.map(tab.props.children, (tabChild) => {
          // If a descendent tab is selected, we render this tab's Tabs
          // component. If a descendent tab is not selected, we don't need to
          // render the Tabs component at all.
          if (isDescendentTabSelected && tabChild.type === Tabs) {
            // We clone the descendent Tabs component and remove the current
            // tab's ID from the activeTabIDs array.
            return React.cloneElement(
              tabChild,
              {
                activeTabIDs: activeTabIDs.slice(1),
                isDescendent: true
              }
            );
          } else if (tabChild.type === Tabs) {
            return null;
          }

          // If a descendent tab is selected, we only want to render the Tabs
          // component and not any other child.
          if (isDescendentTabSelected) {
            return null;
          }

          return tabChild;
        });
      }
    });

    return content;
  }

  getMenuItems(children, tabPath = []) {
    let {activeTabIDs} = this.state;

    // We itrate over the children of Tabs to constructing the menu.
    return React.Children.map(children, (tab, index) => {
      let shouldActivateDefaultTab = (index === 0 && tabPath.length === 0
        && activeTabIDs.length === 0);
      let isActive = shouldActivateDefaultTab || (activeTabIDs.length !== 0
        && activeTabIDs[activeTabIDs.length - 1] === tab.props.id);
      let classes = classNames(
        'menu-tabbed-item',
        {
          'descendent-active': activeTabIDs.includes(tab.props.id) && !isActive,
          active: isActive
        }
      );
      let childTabs = null;
      let nextTabPath = [...tabPath, tab.props.id];

      // We iterate over the children of each Tab and recursively search for
      // descendent Tabs components to construct the descendent menus.
      React.Children.forEach(tab.props.children, (tabChild) => {
        if (tabChild.type === Tabs) {
          childTabs = (
            <ul className="menu-tabbed menu-tabbed-descendent list-unstyled">
              {this.getMenuItems(tabChild.props.children, nextTabPath)}
            </ul>
          );
        }
      });

      return (
        <li className={classes} key={index}>
          <div className="menu-tabbed-item-label"
            onClick={this.handleTabClick.bind(this, tab, nextTabPath)}>
            {tab.props.label}
          </div>
          {childTabs}
        </li>
      );
    });
  }

  render() {
    let {props} = this;
    let contentClasses = classNames(
      'menu-tabbed-content',
      props.contentClassName
    );

    let tabContent = (
      <div className={contentClasses}>
        {this.getTabContent(props.children)}
      </div>
    );

    // If this Tabs component is a descendent of another, we only return the
    // tab's content.
    if (props.isDescendent) {
      return tabContent;
    }

    let classes = classNames(
      `menu-tabbed-container menu-tabbed-container-${props.orientation}`,
      {
        'menu-tabbed-container-fill-container': props.fillContainer
      },
      props.className
    );
    let menuItems = this.getMenuItems(props.children);
    let tabMenu = null;

    // Pass the menu buttons an external renderer, if specified.
    if (props.externalTabRender) {
      props.externalTabRender(menuItems);
    } else {
      let menuClasses = classNames(
        'menu-tabbed list-unstyled',
        props.menuClassName
      );

      tabMenu = (
        <ul className={menuClasses}>
          {menuItems}
        </ul>
      );
    }

    return (
      <div className={classes}>
        {tabMenu}
        {tabContent}
      </div>
    );
  }
}

Tabs.defaultProps = {
  isDescendent: false,
  orientation: 'horizontal'
};

const classProps = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

Tabs.propTypes = {
  activeTabIDs: React.PropTypes.array,
  className: classProps,
  contentClassName: classProps,
  externalTabRender: React.PropTypes.func,
  fillContainer: React.PropTypes.bool,
  menuClassName: classProps,
  menuItemClassName: classProps,
  onTabClick: React.PropTypes.func,
  orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),
  isDescendent: React.PropTypes.bool
};

module.exports = Tabs;
