
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowSlot(task, data, meta) {

  if (! (task instanceof IperNode))
    throw new Error()

  IperNode.call(this, task.graph, data, meta)
}

util.inherits(DflowSlot, IperNode)

module.exports = DflowSlot

