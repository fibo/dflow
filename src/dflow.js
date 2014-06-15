
var path = require('path')

var algorithm    = require('./algorithm')
  , Graph        = require('./Graph')
  , Registry     = require('./Registry')
  , corePlugin   = require('./plugin/core')
  , windowPlugin = require('./plugin/window')

for (var i in algorithm)
  exports[i] = algorithm[i]

exports.example = {
  // TODO add graphs dynamically
  'graph1': require('../examples/graphs/graph1.json'),
  'graph2': require('../examples/graphs/graph2.json')
}

exports.Graph = Graph

exports.Registry = Registry

exports.plugin = {}

/**
 * Convert a foreign package to a dflow plugin
 *
 * ```js
 * var _ = require('underscore')
 *
 * var underscorePlugin = dflow.pluginFrom(_, '_')
 *
 * dflow.use(underscorePlugin)
 * ```
 *
 * @param {Object} pkg to convert
 * @param {String} name of plugin
 *
 * @return {Function} plugin that dflow can use
 */

function pluginFrom (pkg, name) {
  var plugin = function (dflow) {
    for (var item in pkg) {
      dflow.register(name + '.' + item, pkg[item])
    }
  }

  plugin.name = name

  return plugin
}

exports.pluginFrom = pluginFrom

/**
 * Import plugin
 *
 * A dflow plugin is a function that accepts `dflow` as parameter.
 *
 * A simple plugin, in file myplugin.js
 *
 * ```js
 * module.exports = function myplugin (dflow) {
 *   dflow.register('foo', function bar () { return 'quz' })
 * }
 * ```
 *
 * If the exported function is named, for instance *myplugin*, dflow will store
 * it in the `dflow.plugin` object.
 *
 * Make it easy!
 *
 * * If plugin *foo* is stored in a file, name it *foo.js*.
 * * If plugin *foo* is stored in a package, name it *foo* and add a *dflow-plugin* keyword.
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
 *
 * @return {Object} dflow
 */

function use (plugin) {
  plugin(exports)

  // Export plugin as a dflow.plugin item
  if (plugin.name.length > 0)
    exports.plugin[plugin.name] = plugin

  return exports
}

exports.use = use

// Load core plugin at compile time
use(corePlugin)

// Load window plugin if it seems there is a window
if (typeof global.window === 'object') {
  use(windowPlugin)
}

