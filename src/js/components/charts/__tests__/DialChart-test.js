var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../DialChart');
jest.dontMock('../DialSlice');
jest.dontMock('../../../mixins/InternalStorageMixin');
jest.dontMock('classnames');
var DialChart = require('../DialChart');

describe('DialChart', function () {

  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <DialChart
        data={[]}
        label={'Items'}
        unit={100} />
    );
  });

  describe('#getNormalizedData', function () {

    it('returns a single-member grey set when no data is present', function () {
      var normalizedData = this.instance.getNormalizedData([
          { name: 'TASK_1', value: 0 },
          { name: 'TASK_2', value: 0 }
        ], []
      );
      expect(normalizedData).toEqual([
        { colorIndex: 7, value: 1 }
      ]);
    });

    it('returns the union of its slices and its data', function () {
      var normalizedData = this.instance.getNormalizedData(
        [{ name: 'TASK_1', value: 0 }, { name: 'TASK_2', value: 0 }],
        [{ name: 'TASK_2', value: 10 }, { name: 'TASK_3', value: 20 }]
      );
      expect(normalizedData).toEqual([
        { name: 'TASK_1', value: 0 },
        { name: 'TASK_2', value: 10 },
        { name: 'TASK_3', value: 20 }
      ]);
    });

  });

  describe('#isEmpty', function () {

    it('returns true if there is no data', function () {
      var empty = this.instance.isEmpty([]);
      expect(empty).toBe(true);
    });

    it('returns true if the data sums to 0', function () {
      var empty = this.instance.isEmpty([
        { value: 0 }, { value: 0 }, { value: 0 }
      ]);
      expect(empty).toBe(true);
    });

    it('returns false if the data sums to more than 0', function () {
      var empty = this.instance.isEmpty([
        { value: 0 }, { value: 1 }, { value: 0 }
      ]);
      expect(empty).toBe(false);
    });

  });

  describe('#render', function () {

    beforeEach(function () {
      this.instance.setProps({data: [
        {name: 'TASK_1', value: 3},
        {name: 'TASK_2', value: 1}
      ]});
    });

    it('when no data is present, it renders a single \'empty\' slice to the DOM', function () {
      this.instance.setProps({
        slices: [ { name: 'TASK_1' }, { name: 'TASK_2' } ],
        data: []
      });
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, 'arc'
      );
      expect(slices.length).toEqual(1);
    });

    it('renders a slice for each category of tasks', function () {
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, 'arc'
      );
      expect(slices.length).toEqual(2);
    });

    it('does not remove 0-length slices from the DOM', function () {
      this.instance.setProps({
        slices: [ { name: 'TASK_1' }, { name: 'TASK_2' } ],
        data: [ { name: 'TASK_1', value: 4 } ]
      });
      var slices = TestUtils.scryRenderedDOMComponentsWithClass(
        this.instance, 'arc'
      );
      expect(slices.length).toEqual(2);
    });

  });

  describe('#getRadius', function () {

    it('uses the width of its container when no height is set', function () {
      var r = this.instance.getRadius({ width: 100 });
      expect(r).toEqual(50);
    });

    it('uses the width of its container when both are available and w < h', function () {
      var r = this.instance.getRadius({ width: 100, height: 120 });
      expect(r).toEqual(50);
    });

    it('uses the height of its container when both are available and h < w', function () {
      var r = this.instance.getRadius({ width: 120, height: 100 });
      expect(r).toEqual(50);
    });

  });

});
