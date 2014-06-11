
var algorithm = require('./algorithm')
  , Graph     = require('./Graph')
  , Registry  = require('./Registry')
  , core      = require('./plugin/core')

for (var i in algorithm)
  exports[i] = algorithm[i]

exports.Graph = Graph

exports.Registry = Registry

exports.plugin = {}
exports.plugin.core = require('./plugin/core')
exports.plugin.window = require('./plugin/window')

function use (plugin) {
  plugin(exports)
}

exports.use = use

// Load core plugins at compile time
use(core)

