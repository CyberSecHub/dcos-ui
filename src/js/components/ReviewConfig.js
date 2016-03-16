import GeminiScrollbar from 'react-gemini-scrollbar';
import React from 'react';

import DescriptionList from './DescriptionList';
import GeminiUtil from '../utils/GeminiUtil';
import IconDownload from './icons/IconDownload';

class ReviewConfig extends React.Component {
  componentDidMount() {
    // Timeout necessary due to modal content height updates on did mount
    setTimeout(() => {
      GeminiUtil.updateWithRef(this.refs.gemini);
    });
  }

  getHeader() {
    let {
      configuration,
      packageIcon,
      packageName,
      packageType,
      packageVersion
    } = this.props;
    let fileName = 'config.json';
    let configString = JSON.stringify(configuration, null, 2);
    let ieDownloadConfig = function () {
      // Download if on IE
      if (global.window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([configString], {type: 'application/json'});
        global.window.navigator.msSaveOrOpenBlob(blob, fileName);
      }
    };

    return (
      <div className="modal-header modal-header-bottom-border modal-header-white flex-no-shrink">
        <div className="row">
          <div className="column-4">
            <div className="media-object-spacing-wrapper media-object-spacing-narrow">
              <div className="media-object media-object-align-middle">
                <div className="media-object-item">
                  <img
                    className="icon icon-sprite icon-sprite-medium icon-sprite-medium-color icon-image-container icon-app-container"
                    src={packageIcon} />
                </div>
                <div className="media-object-item">
                  <h4 className="flush-top flush-bottom text-color-neutral">
                    {packageName}
                  </h4>
                  <span className="side-panel-resource-label">
                    {`${packageType} ${packageVersion}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="column-8 text-align-right">
            <a
              className="button button-stroke button-rounded"
              onClick={ieDownloadConfig}
              download={fileName}
              href={`data:attachment/json;content-disposition=attachment;filename=${fileName};charset=utf-8,${encodeURIComponent(configString)}`}>
              <IconDownload /> Download config.json
            </a>
          </div>
        </div>
      </div>
    );
  }

  getFieldTitle(title) {
    return <h3 key={`${title}-header`}>{title}</h3>;
  }

  getFieldSubheader(title) {
    return (<h5 key={`${title}-subheader`}>{title}</h5>);
  }

  getDefinitionReview() {
    var elementsToRender = [];
    let {configuration} = this.props;
    let fields = Object.keys(configuration);

    fields.forEach((field, i) => {
      var fieldObj = configuration[field];
      elementsToRender.push(this.getFieldTitle(field));

      Object.keys(fieldObj).forEach((fieldKey) => {
        let fieldValue = fieldObj[fieldKey];
        let uniqueKey = `${i}${fieldKey}`;

        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)
          && fieldValue !== null) {
          elementsToRender.push(
            this.getFieldSubheader(fieldKey),
            this.renderDescriptionList(fieldValue, uniqueKey)
          );
          return;
        }

        if (Array.isArray(fieldValue)) {
          fieldValue = fieldValue.join(' ');
        }

        elementsToRender.push(
          this.renderDescriptionList({[fieldKey]: fieldValue}, uniqueKey)
        );
      });
    });

    return elementsToRender;
  }

  renderDescriptionList(hash, key) {
    return (
      <DescriptionList hash={hash} key={key} />
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.getHeader()}
        <GeminiScrollbar ref="gemini" className="modal-content" autoshow={true}>
          <div className="modal-content-inner container container-pod container-pod-short flush-top flush-bottom flex-grow">
            {this.getDefinitionReview()}
          </div>
        </GeminiScrollbar>
      </div>
    );
  }
}

ReviewConfig.defaultProps = {
  className: 'review-config flex-container-col'
};

ReviewConfig.propTypes = {
  className: React.PropTypes.string,
  configuration: React.PropTypes.object.isRequired,
  packageIcon: React.PropTypes.string,
  packageType: React.PropTypes.string,
  packageVersion: React.PropTypes.string
};

module.exports = ReviewConfig;
