
var dflow = require('../index')
  , iper  = require('iper')
  , util  = require('util')

var DflowEdge = dflow.DflowEdge
  , DflowNode = iper.DflowNode

var IperGraph = iper.IperGraph

function DflowGraph() {
  IperGraph.call(this)
}

util.inherits(DflowGraph, IperGraph)

module.exports = DflowGraph

