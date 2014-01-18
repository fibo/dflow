
var iper     = require('iper')
  , inherits = require('inherits')

var IperEdge = iper.IperEdge

function DflowEdge () {

  IperEdge.call(this)

}

inherits(DflowEdge, IperEdge)

module.exports = DflowEdge

