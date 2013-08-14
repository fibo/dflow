
// Keep dflow as minimal as possible. Less is more.

exports.DflowEdge     = require('./lib/DflowEdge')
exports.DflowGraph    = require('./lib/DflowGraph')
exports.DflowInput    = require('./lib/DflowInput')
exports.DflowOutput   = require('./lib/DflowOutput')
exports.DflowScenario = require('./lib/DflowScenario')
exports.DflowTask     = require('./lib/DflowTask')

var dflowRoot = require('./lib/dflowRoot')
function getDflowRoot() { return dflowRoot }
Object.defineProperty(exports, 'root', {get: getDflowRoot})

