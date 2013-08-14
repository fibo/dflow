
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowOutput(task, data) {

  if (! (task instanceof IperNode))
    throw new Error()

  var graph = task.graph

  IperNode.call(this, graph, data)
}

util.inherits(DflowOutput, IperNode)

module.exports = DflowOutput

