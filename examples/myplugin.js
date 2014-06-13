
/**
 * Example plugin
 *
 * Usage
 *
 * ```js
 * var dflow = require('dflow')
 *   , myplugin = require('./myplugin.js')
 *
 * dflow.use(myplugin)
 * ```
 *
 * Note that if exported function is named it will be added to `dflow.plugin` object
 */

module.exports = function myplugin (dflow) {
  dflow.register('mytask', function mytask (a) { return a + 1 })
}

