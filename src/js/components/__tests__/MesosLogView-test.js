jest.dontMock('../../constants/StoreConfig');
jest.dontMock('../../stores/MesosLogStore');
jest.dontMock('../../utils/Util');
jest.dontMock('../../utils/DOMUtils');
jest.dontMock('../../utils/RequestUtil');
jest.dontMock('../../structs/SummaryList');
jest.dontMock('../Highlight');
jest.dontMock('../MesosLogView');

require('../../utils/StoreMixinConfig');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var MesosLogStore = require('../../stores/MesosLogStore');
var MesosLogView = require('../MesosLogView');
var DOMUtil = require('../../utils/DOMUtils');

describe('MesosLogView', function () {
  beforeEach(function () {

    // Store original versions
    this.storeStartTailing = MesosLogStore.startTailing;
    this.storeStopTailing = MesosLogStore.stopTailing;
    this.mesosLogStoreGet = MesosLogStore.get;

    // Create spies
    MesosLogStore.startTailing = jasmine.createSpy('startTailing');
    MesosLogStore.stopTailing = jasmine.createSpy('stopTailing');

    this.instance = TestUtils.renderIntoDocument(
      <MesosLogView filePath="/some/file/path" slaveID="foo" />
    );

    this.instance.setState = jasmine.createSpy('setState');

    MesosLogStore.get = jasmine.createSpy('MesosLogStore#get').andReturn({
      getFullLog: function () {
        return 'foo';
      }
    });
  });

  afterEach(function () {
    // Restore original functions
    MesosLogStore.startTailing = this.storeStartTailing;
    MesosLogStore.stopTailing = this.storeStopTailing;
    MesosLogStore.get = this.mesosLogStoreGet;
  });

  describe('#componentDidMount', function () {

    it('should call startTailing when component mounts', function () {
      expect(MesosLogStore.startTailing).toHaveBeenCalled();
    });

  });

  describe('#componentWillReceiveProps', function () {

    it('should call startTailing when new path is provided', function () {
      this.instance.componentWillReceiveProps({filePath: '/other/file/path'});
      expect(MesosLogStore.startTailing.callCount).toEqual(2);
    });

    it('should call stopTailing when new path is provided', function () {
      this.instance.componentWillReceiveProps({filePath: '/other/file/path'});
      expect(MesosLogStore.stopTailing.callCount).toEqual(1);
    });

    it('shouldn\'t call startTailing when same path is provided', function () {
      this.instance.componentWillReceiveProps({filePath: '/some/file/path'});
      expect(MesosLogStore.startTailing.callCount).toEqual(1);
    });

    it('shouldn\'t call stopTailing when same path is provided', function () {
      this.instance.componentWillReceiveProps({filePath: '/some/file/path'});
      expect(MesosLogStore.stopTailing.callCount).toEqual(0);
    });

  });

  describe('#componentWillUnmount', function () {

    it('should call stopTailing when component unmounts', function () {
      this.instance.componentWillUnmount();
      expect(MesosLogStore.stopTailing).toHaveBeenCalled();
    });

  });

  describe('#onMesosLogStoreError', function () {

    it('should setState when path matches', function () {
      this.instance.onMesosLogStoreError('/some/file/path');
      expect(this.instance.setState).toHaveBeenCalled();
    });

    it('shouldn\'t setState when path doesn\'t match', function () {
      this.instance.onMesosLogStoreError('/other/file/path');
      expect(this.instance.setState).not.toHaveBeenCalled();
    });

  });

  describe('#onMesosLogStoreSuccess', function () {

    it('should setState when path matches', function () {
      this.instance.onMesosLogStoreSuccess('/some/file/path');
      expect(this.instance.setState).toHaveBeenCalled();
    });

    it('shouldn\'t setState when path doesn\'t match', function () {
      this.instance.onMesosLogStoreSuccess('/other/file/path');
      expect(this.instance.setState).not.toHaveBeenCalled();
    });

  });

  describe('#handleLogContainerScroll', function () {
    beforeEach(function () {
      this.previousGetPrevious = MesosLogStore.getPreviousLogs;
      this.previousGetComputed = DOMUtil.getComputedDimensions;

      DOMUtil.getComputedDimensions = function () {
        return {height: 100};
      };

      MesosLogStore.getPreviousLogs = jasmine.createSpy();
    });

    afterEach(function () {
      DOMUtil.getComputedDimensions = this.previousGetComputed;
      MesosLogStore.getPreviousLogs = this.previousGetPrevious;
    });

    it('should not call getPreviousLogs if past 2000 pixels', function () {
      var event = {target: {scrollTop: 4000}};
      this.instance.handleLogContainerScroll(event);

      expect(MesosLogStore.getPreviousLogs).not.toHaveBeenCalled();
    });

    it('should not call getPreviousLogs if below 2000 pixels', function () {
      var event = {target: {scrollTop: 1000}};
      this.instance.handleLogContainerScroll(event);

      expect(MesosLogStore.getPreviousLogs).toHaveBeenCalled();
    });
  });

  describe('#getLog', function () {

    it('should show empty log when fullLog is empty string', function () {
      this.instance.state.fullLog = '';
      var div = this.instance.getLog();
      expect(TestUtils.isElementOfType(div, 'div')).toEqual(true);
    });

    it('should not show empty log when fullLog is populated', function () {
      this.instance.state.fullLog = 'foo';
      var pre = this.instance.getLog();
      expect(TestUtils.isElementOfType(pre, 'pre')).toEqual(true);
    });

    it('shouldn\'t call getLog when log is null', function () {
      this.instance.state.fullLog = null;
      this.instance.getLog = jasmine.createSpy('getLog');
      this.instance.render();
      expect(this.instance.getLog).not.toHaveBeenCalled();
    });

    it('should call getLog when log is empty', function () {
      this.instance.state.fullLog = '';
      this.instance.getLog = jasmine.createSpy('getLog');
      this.instance.render();
      expect(this.instance.getLog).toHaveBeenCalled();
    });

    it('should call getLog when log is populated', function () {
      this.instance.state.fullLog = 'foo';
      this.instance.getLog = jasmine.createSpy('getLog');
      this.instance.render();
      expect(this.instance.getLog).toHaveBeenCalled();
    });

  });

  describe('#getGoToBottomButton', function () {

    it('should not return a button if currently at the bottom', function () {
      this.instance.state.isAtBottom = true;
      var button = this.instance.getGoToBottomButton();
      expect(button).toEqual(null);
    });

    it('should return a button if not at bottom', function () {
      this.instance.state.isAtBottom = false;
      var button = this.instance.getGoToBottomButton();
      expect(TestUtils.isElementOfType(button, 'button')).toEqual(true);
    });

  });

  describe('#render', function () {

    it('should call getErrorScreen when error occured', function () {
      this.instance.state.hasLoadingError = 3;
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');

      this.instance.render();
      expect(this.instance.getErrorScreen).toHaveBeenCalled();
    });

    it('ignores getErrorScreen when error has not occured', function () {
      this.instance.state.hasLoadingError = 2;
      this.instance.getErrorScreen = jasmine.createSpy('getErrorScreen');

      this.instance.render();
      expect(this.instance.getErrorScreen).not.toHaveBeenCalled();
    });

    it('shouldn\' call getLoadingScreen when fullLog is empty', function () {
      this.instance.state.fullLog = '';
      MesosLogStore.get = jasmine.createSpy('MesosLogStore#get');
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

    it('should call getLoadingScreen when fullLog is null', function () {
      this.instance.state.fullLog = null;
      MesosLogStore.get = jasmine.createSpy('MesosLogStore#get');
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).toHaveBeenCalled();
    });

    it('ignores getLoadingScreen if fullLog has data', function () {
      this.instance.state.fullLog = 'foo';
      MesosLogStore.get = jasmine.createSpy('MesosLogStore#get');
      this.instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');

      this.instance.render();
      expect(this.instance.getLoadingScreen).not.toHaveBeenCalled();
    });

    it('should call getLoadingScreen when filePath is undefined', function () {
      var instance = TestUtils.renderIntoDocument(
        <MesosLogView slaveID="foo" />
      );
      instance.state.fullLog = null;

      instance.getLoadingScreen = jasmine.createSpy('getLoadingScreen');
      instance.render();

      expect(instance.getLoadingScreen).toHaveBeenCalled();
    });

  });

});
