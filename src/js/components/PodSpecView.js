import React from 'react';

import DescriptionList from './DescriptionList';
import KeyIconLink from './KeyIconLink';
import PodSpec from '../structs/PodSpec';
import PodContainerSpecView from './PodContainerSpecView';

const METHODS_TO_BIND = [
];

class PodSpecView extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  getEnvironmentDetails() {
    let {spec} = this.props;
    let environment = Object.assign({}, spec.getEnvironment());

    if (Object.keys(environment).length === 0) {
      return null;
    }

    Object.keys(environment).forEach(function (key) {
      let value = environment[key];
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        environment[key] = (
          <KeyIconLink
            url={`#${value.secret}`}
            text={value.secret} />
        );
      }
    });

    return (
      <div>
        <h4 className="inverse flush-top">
          Environment variables
        </h4>
        <DescriptionList hash={environment} />
      </div>
    );
  }

  getSecretsDetails() {
    let {spec} = this.props;
    let secrets = Object.assign({}, spec.getSecrets());

    if (Object.keys(secrets).length === 0) {
      return null;
    }

    Object.keys(secrets).forEach(function (key) {
      let value = secrets[key];
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        secrets[key] = (
          <KeyIconLink
            url={`#${value.source}`}
            text={value.source} />
        );
      }
    });

    return (
      <div>
        <h4 className="inverse flush-top">
          Secrets
        </h4>
        <DescriptionList hash={secrets} />
      </div>
    );
  }

  getLabelsDetails() {
    let {spec} = this.props;
    let labels = spec.getLabels();

    if (Object.keys(labels).length === 0) {
      return null;
    }

    return (
      <div>
        <h4 className="inverse flush-top">
          Labels
        </h4>
        <DescriptionList hash={labels} />
      </div>
    );
  }

  getGeneralDetails() {
    let {spec} = this.props;
    let hash = {
      'ID': spec.getId()
    };

    let version = spec.getVersion();
    if (version) {
      hash.version = version;
    }

    let user = spec.getUser();
    if (user) {
      hash.user = user;
    }

    return <DescriptionList hash={hash} />;
  }

  render() {
    let {spec} = this.props;

    return (
      <div>
        <h4 className="inverse flush-top">
          General
        </h4>
        {this.getGeneralDetails()}
        {this.getLabelsDetails()}
        {this.getEnvironmentDetails()}
        {this.getSecretsDetails()}
        <h4 className="inverse flush-top">
          Containers
        </h4>
        {spec.getContainers().map(function (container, i) {
          return (
              <PodContainerSpecView
                key={i}
                className="nested-description-list"
                container={container} />
            );
        })}
      </div>
      );
  }
};

PodSpecView.contextTypes = {
  router: React.PropTypes.func
};

PodSpecView.propTypes = {
  spec: React.PropTypes.instanceOf(PodSpec)
};

module.exports = PodSpecView;
