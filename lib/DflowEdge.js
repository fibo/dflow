
var iper  = require('iper')
  , util  = require('util')

var IperEdge = iper.IperEdge

function DflowEdge() {

  IperEdge.call(this)
}

util.inherits(DflowEdge, IperEdge)

module.exports = DflowEdge


