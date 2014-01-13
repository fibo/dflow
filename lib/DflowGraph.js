
var dflow    = require('../index')
  , iper     = require('iper')
  , inherits = require('inherits')

var DflowEdge = dflow.DflowEdge
  , DflowNode = iper.DflowNode

var IperGraph = iper.IperGraph

function DflowGraph() {
  IperGraph.call(this)
}

inherits(DflowGraph, IperGraph)

module.exports = DflowGraph

