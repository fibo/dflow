
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowInput(task, data) {

  var meta = {maxDegree:1}

  if (! (task instanceof IperNode))
    throw new Error()

  IperNode.call(this, task.graph, data, meta)
}

util.inherits(DflowInput, IperNode)

module.exports = DflowInput

