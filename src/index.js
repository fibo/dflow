
var algorithm = require('./algorithm')
  , Graph     = require('./Graph')
  , Registry  = require('./Registry')
  , core      = require('./plugin/core')

for (var i in algorithm)
  exports[i] = algorithm[i]

exports.Graph = Graph

exports.Registry = Registry

exports.plugin = {
  core: core,
  window: require('./plugin/window')
}

/**
 * Import plugin
 *
 * A dflow plugin is a function that accepts `dflow` as parameter.
 *
 * A simple plugin
 *
 * ```js
 * module.exports = function (dflow) {
 *   dflow.register('foo', function bar () { return 'quz' })
 * }
 * ```
 *
 * How to import it
 *
 * ```js
 * var dflow = require('dflow')
 *   , myplugin = require('./myplugin')
 *
 * dflow.use(myplugin)
 * ```
 *
 * @param {Function} plugin to be imported
 */

function use (plugin) {
  plugin(exports)
}

exports.use = use

// Load core plugin at compile time
use(core)

