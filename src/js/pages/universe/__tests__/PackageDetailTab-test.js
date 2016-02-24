jest.dontMock('../PackageDetailTab');
jest.dontMock('../../../components/Panel');
jest.dontMock('../../../events/AppDispatcher');
jest.dontMock('../../../events/CosmosPackagesActions');
jest.dontMock('../../../stores/CosmosPackagesStore');
jest.dontMock('../../../../../tests/_fixtures/cosmos/package-describe.json');

var JestUtil = require('../../../utils/JestUtil');

JestUtil.unMockStores(['CosmosPackagesStore']);

// Setting useFixtures for when we load StoreMixinConfig
var Config = require('../../../config/Config');
var configUseFixtures = Config.useFixtures;
Config.useFixtures = true;
require('../../../utils/StoreMixinConfig');
Config.useFixtures = configUseFixtures;

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var PackageDetailTab = require('../PackageDetailTab');

describe('PackageDetailTab', function () {

  beforeEach(function () {
    this.container = document.createElement('div');
    this.instance = ReactDOM.render(
      <PackageDetailTab params={{packageName: 'marathon'}} />,
      this.container
    );
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(this.container);
  });

  describe('#handleInstallModalOpen', function () {

    beforeEach(function () {
      this.instance.handleInstallModalOpen =
        jasmine.createSpy('handleInstallModalOpen');
      jest.runAllTimers();
    });

    it('should call handler when install button is clicked', function () {
      var installButton = ReactDOM.findDOMNode(this.instance)
        .querySelector('.button.button-success');
      TestUtils.Simulate.click(installButton);

      expect(this.instance.handleInstallModalOpen
          .mostRecentCall.args[0].get('package').name).toEqual('marathon');
    });

  });

  describe('#getItems', function () {

    describe('#getItem', function () {

      it('should return null if only null values is provided', function () {
        expect(
          this.instance.getItems({foo: null, bar: null}),
          this.instance.getItem).toEqual(null);
      });

      it('should return only entries with defined values', function () {
        expect(this.instance.getItems({foo: 'baz', bar: null}, this.instance.getItem).length)
          .toEqual(1);
      });

      it('should render entries with keys and values', function () {
        var subItem = ReactDOM.render(
          this.instance.getItems({foo: 'baz', bar: null}, this.instance.getItem)[0],
          this.container
        );

        expect(subItem.textContent).toEqual('foobaz');
      });

    });

    describe('#getSubItem', function () {

      it('should return null if only null values is provided', function () {
        expect(this.instance.getItems({foo: null, bar: null}), this.instance.getSubItem).toEqual(null);
      });

      it('should return only entries with defined values', function () {
        expect(this.instance.getItems({foo: 'baz', bar: null}, this.instance.getSubItem).length)
          .toEqual(1);
      });

      it('should render entries with keys and values', function () {
        var subItem = ReactDOM.render(
          this.instance.getItems({foo: 'baz', bar: null}, this.instance.getSubItem)[0],
          this.container
        );

        expect(subItem.textContent).toEqual('foo: baz');
      });

    });

  });

  describe('#getLicenses', function () {

    it('should return null for an object', function () {
      expect(this.instance.getLicenses({})).toEqual(null);
    });

    it('should return null for null', function () {
      expect(this.instance.getLicenses(null)).toEqual(null);
    });

    it('should return null for undefined', function () {
      expect(this.instance.getLicenses(undefined)).toEqual(null);
    });

    it('should return empty object for empty array', function () {
      expect(this.instance.getLicenses([])).toEqual({});
    });

    it('should return all entries of array', function () {
      var licenses = this.instance.getLicenses([
        {name: 'foo', url: 'bar'},
        {name: 'baz', url: 'qux'},
        {name: 'quux', url: 'corge'}
      ]);

      expect(Object.keys(licenses).length).toEqual(3);
    });

    it('should return all entries even with undefined values', function () {
      var licenses = this.instance.getLicenses([
        {name: 'foo', url: 'bar'},
        {name: 'baz', url: null},
        {name: 'quux', url: 'corge'}
      ]);

      expect(Object.keys(licenses).length).toEqual(3);
    });

  });

  describe('#getSubItem', function () {

    it('should render link if url is defined', function () {
      var link = ReactDOM.render(
        this.instance.getSubItem('url', 'http://foo'),
        this.container
      );

      expect(link.textContent).toEqual('url: http://foo');
      expect(link.querySelector('a').href).toEqual('http://foo/');
      expect(link.querySelector('a').tagName).toEqual('A');
    });

    it('should render link with prefix if defined', function () {
      var link = ReactDOM.render(
        this.instance.getSubItem('email', 'foo@bar.com'),
        this.container
      );

      expect(link.textContent).toEqual('email: foo@bar.com');
      expect(link.querySelector('a').href).toEqual('mailto:foo@bar.com');
      expect(link.querySelector('a').tagName).toEqual('A');
    });

  });

  describe('#render', function () {

    it('should call getErrorScreen when error occured', function () {
      this.instance.state.hasError = true;
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');

      this.instance.render();
      expect(this.instance.getErrorScreen).toHaveBeenCalled();
    });

    it('ignores getErrorScreen when error has not occured', function () {
      this.instance.state.hasError = false;
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');

      this.instance.render();
      expect(this.instance.getErrorScreen).not.toHaveBeenCalled();
    });

    it('should call getLoadingScreen when loading', function () {
      this.instance.state.isLoading = true;
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).toHaveBeenCalled();
    });

    it('ignores getLoadingScreen when not loading', function () {
      this.instance.state.isLoading = false;
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

    it('ignores getLoadingScreen when error has occured', function () {
      this.instance.state.hasError = true;
      this.instance.state.isLoading = true;
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

  });

});
