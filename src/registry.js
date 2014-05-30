

/**
 * Return a value
 *
 * @api private
 */

function x (val) {
  return function () {
    return val
  }
}

var registry = {
  'console.log': console.log,
  'Math.max': Math.max,
  'Math.min': Math.min,
  'Math.PI': x(Math.PI),
  'string': function string (x) { if (typeof x === 'string') return x },
  'typeof' : function (x) { return typeof x }
}

module.exports = registry

