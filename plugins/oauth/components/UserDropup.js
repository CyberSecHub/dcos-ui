import {Dropdown, Modal} from 'reactjs-components';
import React from 'react';

let SDK = require('../SDK').getSDK();

let AuthStore = SDK.get('AuthStore');

const METHODS_TO_BIND = [
  'handleDropdownClose',
  'handleDropdownClick',
  'handleSignOut'
];

const MENU_ITEMS = {
  'button-docs': 'Documentation',
  'button-intercom': 'Talk with us',
  'button-tour': 'Install CLI',
  'button-sign-out': 'Sign Out'
};

class UserDropup extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      open: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleDropdownClose() {
    let open = this.state.open;
    if (open) {
      window.removeEventListener('resize', this.handleDropdownClose);
      this.setState({open: false});
    }
  }

  handleDropdownClick() {
    let open = !this.state.open;
    if (open) {
      window.addEventListener('resize', this.handleDropdownClose);
    }

    this.setState({open});
  }

  handleSignOut() {
    AuthStore.logout();
  }

  handleMenuItemClick(onClick, e) {
    this.handleDropdownClose();
    if (onClick) {
      // Wait until dropdown transition is done before starting the next
      setTimeout(function () {
        onClick(e);
      }, 250);
    }
  }

  getDropdownMenu(menuItems) {
    let defaultItem = [
      {
        className: 'hidden',
        html: '',
        id: 'default-item',
        selectedHtml: this.getUserButton(null, function () {})
      }
    ];

    return defaultItem.concat(menuItems.map(function (item) {
      return {
        className: 'clickable',
        html: item,
        id: item.key,
        selectedHtml: item
      };
    }));
  }

  getModalMenu(menuItems) {
    return menuItems.map(function (item) {
      return (
        <li className="clickable" key={item.key}>
          {item}
        </li>
      );
    });
  }

  getUserButton(user, clickHandler) {
    let description;
    let userLabel;

    if (user != null) {
      userLabel = user.description;

      if (user.is_remote) {
        userLabel = user.uid;
      }
    }

    if (userLabel != null) {
      description = (
        <span className="user-description">
          {userLabel}
        </span>
      );
    }

    return (
      <div className="icon-buttons">
        <a
          className="user-dropdown button dropdown-toggle"
          onClick={clickHandler}>
          <span className="icon icon-medium icon-image-container
            icon-user-container">
            <img
              className="clickable"
              src="./img/layout/icon-user-default-64x64@2x.png" />
          </span>
          {description}
        </a>
      </div>
    );
  }

  getUserMenuItems() {
    let items = this.props.items.concat([
      <a onClick={this.handleSignOut} key="button-sign-out" />
    ]);

    return items.map((item) => {
      // Override classes and tooltip, and monkeypatch the onClick to close
      // the dropdown
      let props = {
        className: '',
        'data-behavior': '',
        'data-tip-content': '',
        'data-tip-place': '',
        onClick: this.handleMenuItemClick.bind(this, item.props.onClick)
      };

      return React.cloneElement(item, props, MENU_ITEMS[item.key]);
    });
  }

  render() {
    let user = AuthStore.getUser();
    if (user == null) {
      return null;
    }

    let modalClasses = {
      bodyClass: '',
      containerClass: 'user-dropdown-menu dropdown',
      innerBodyClass: '',
      modalClass: 'dropdown-menu'
    };

    let userButton = this.getUserButton(user, this.handleDropdownClick);
    let userMenuItems = this.getUserMenuItems();

    return (
      <div>
        <Dropdown buttonClassName="sidebar-footer-user-dropdown-button"
          dropdownMenuClassName="dropdown-menu"
          dropdownMenuListClassName="dropdown-menu-list"
          items={this.getDropdownMenu(userMenuItems)}
          persistentID="default-item"
          transition={true}
          wrapperClassName="sidebar-footer-user-dropdown dropdown" />
        <div className="open">
          {userButton}
        </div>
        <Modal
          maxHeightPercentage={0.9}
          onClose={this.handleDropdownClose}
          open={this.state.open}
          showCloseButton={false}
          showHeader={false}
          showFooter={false}
          transitionNameModal="user-dropdown-menu"
          {...modalClasses}>
          {userButton}
          <ul className="dropdown-menu-list">
            {this.getModalMenu(userMenuItems)}
          </ul>
        </Modal>
      </div>
    );
  }
}

UserDropup.contextTypes = {
  router: React.PropTypes.func
};

UserDropup.defaultProps = {
  items: []
};

UserDropup.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.node)
};

module.exports = UserDropup;
