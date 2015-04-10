var Maths = {
  round: function (value, precision) {
    precision = precision || 0;
    var factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  },

  /**
   * maps to domain (0,1)
   *
   * @param  {Number} value Number in range
   * @param  {Object} stats
   * @param  {Number} stats.min Minimum in range
   * @param  {Number} stats.max Maximum in range
   * @return {Number} A mapped number between (0,1)
   **/
  mapValue: function (value, stats) {
    value = parseFloat(value);

    var range = stats.max - stats.min;
    var min = stats.min;

    if (range === 0) {
      return min;
    }

    var v = (value - min) / range;

    if (isNaN(v)) {
      return undefined;
    } else {
      return v;
    }
  },

  /**
   * pass in between 0 and 1
   *
   * @param  {Number} value Mapped number between (0,1)
   * @param  {Object} stats
   * @param  {Number} stats.min Minimum in range
   * @param  {Number} stats.max Maximum in range
   * @return {Number} An unmapped number between in the provided range
   **/
  unmapValue: function (value, stats) {
    value = stats.min + value * (stats.max - stats.min);

    if (isNaN(value)) {
      return undefined;
    } else {
      return value;
    }
  }

};

module.exports = Maths;
