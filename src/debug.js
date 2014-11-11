
// Use *debug* package if available.

var debug

try {
  debug = require('debug')
}
catch (err) {
  debug = function () { return Function.prototype }
}

module.exports = debug

