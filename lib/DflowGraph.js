
var iper = require('iper')
  , util = require('util')

var IperGraph = iper.IperGraph

function DflowGraph() {

  IperGraph.call(this)

}

util.inherits(DflowGraph, IperGraph)

module.exports = DflowGraph

