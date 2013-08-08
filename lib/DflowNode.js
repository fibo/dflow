
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowNode() {

  this.inputs = {}
  this.outputs = {}

  IperNode.call(this, data)
}

util.inherits(DflowNode, IperNode)

module.exports = DflowNode

