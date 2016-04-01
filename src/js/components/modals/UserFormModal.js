import mixin from 'reactjs-mixin';
import {Hooks} from 'PluginSDK';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import {StoreMixin} from 'mesosphere-shared-reactjs';

import UserStore from '../../stores/UserStore';
import FormModal from '../FormModal';

const METHODS_TO_BIND = [
  'handleNewUserSubmit',
  'onUserStoreCreateSuccess'
];

class UserFormModal extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      disableNewUser: false,
      errorMsg: false
    };

    this.store_listeners = [
      {
        name: 'user',
        events: ['createSuccess', 'createError'],
        suppressUpdate: true
      }
    ];

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  onUserStoreCreateSuccess() {
    this.setState({
      disableNewUser: false,
      errorMsg: false
    });
    this.props.onClose();
  }

  onUserStoreCreateError(errorMsg) {
    this.setState({
      disableNewUser: false,
      errorMsg
    });
  }

  handleNewUserSubmit(model) {
    this.setState({disableNewUser: true});
    UserStore.addUser(model);
  }

  getButtonDefinition() {
    return Hooks.applyFilter('userFormModalButtonDefinition', [
      {
        text: 'Cancel',
        className: 'button button-medium',
        isClose: true
      },
      {
        text: 'Add User',
        className: 'button button-success button-medium',
        isSubmit: true
      }
    ]);
  }

  getNewUserFormDefinition() {
    let {props, state} = this;

    return Hooks.applyFilter('userFormModalDefinition', [{
      fieldType: 'text',
      name: 'uid',
      placeholder: 'Email',
      required: true,
      showError: state.errorMsg,
      showLabel: false,
      writeType: 'input',
      validation: function () { return true; },
      value: ''
    }], props, state);
  }

  getHeader() {
    return Hooks.applyFilter('userFormModalHeader', (
      <h2 className="modal-header-title text-align-center flush-top">
        Add User to Cluster
      </h2>
    ));
  }

  render() {
    return (
      <FormModal
        buttonDefinition={this.getButtonDefinition()}
        definition={this.getNewUserFormDefinition()}
        disabled={this.state.disableNewUser}
        onClose={this.props.onClose}
        onSubmit={this.handleNewUserSubmit}
        open={this.props.open}>
        {this.getHeader()}
      </FormModal>
    );
  }
}
module.exports = UserFormModal;
