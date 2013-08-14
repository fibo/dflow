
var DflowGraph    = require('./DflowGraph')
var DflowScenario = require('./DflowScenario')

var graph = new DflowGraph()
var root = new DflowScenario(graph)

module.exports = root

