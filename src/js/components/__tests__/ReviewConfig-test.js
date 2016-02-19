jest.dontMock('../ReviewConfig');

/* eslint-disable no-unused-vars */
var React = require('react');
/* eslint-enable no-unused-vars */
var ReactDOM = require('react-dom');

var ReviewConfig = require('../ReviewConfig');

describe('ReviewConfig', function () {
  beforeEach(function () {
    this.container = document.createElement('div');
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#getDefinitionReview', function () {
    it('renders a subheader for a nested document', function () {
      var normalDocument = {
        'application': {
          'normal': 'value',
          'normal2': 'value2',
          'normal3': 'value3'
        }
      };

      var instance = ReactDOM.render(
        <ReviewConfig jsonDocument={normalDocument} />,
        this.container
      );

      var result = instance.getDefinitionReview();
      expect(result.length).toEqual(4);
    });

    it('renders a subheader for a nested document', function () {
      var nestedDocument = {
        'application': {
          'nested': {
            'name': 'trueValue'
          }
        }
      };

      var instance = ReactDOM.render(
        <ReviewConfig jsonDocument={nestedDocument} />,
        this.container
      );

      var result = instance.getDefinitionReview();
      expect(result).toEqual(3);
    });
  });
});
