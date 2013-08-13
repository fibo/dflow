
var iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowInput() {

  var meta = {maxDegree:1}

  IperNode.call(this, data, meta)
}

util.inherits(DflowInput, IperNode)

module.exports = DflowInput

