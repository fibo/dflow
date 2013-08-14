
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowSlot(graph, data) {
  IperNode.call(this, graph, data)
}

util.inherits(DflowSlot, IperNode)

module.exports = DflowSlot

