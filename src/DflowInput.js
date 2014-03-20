
var DflowEdge  = require('./DflowEdge')
  , DflowSflot = require('./DflowSlot')
  , inherits   = require('inherits')

function DflowInput () {
  DflowSlot.apply(this, arguments)

  this.edge = null
}

inherits(DflowInput, DflowSlot)

/**
 * @return boolean
 */
function isConnected () {
  return this.edge instanceof DflowEdge
}

DflowInput.prototype.isConnected = isConnected

module.exports = DflowInput

