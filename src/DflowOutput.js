
var DflowSlot = require('./DflowSlot')
  , inherits = require('inherits')

function DflowOutput () {
  DflowSlot.apply(this, arguments)

  this.edges = []
}

inherits(DflowOutput, DflowSlot)

/*
 * @return boolean
 */

function isConnected () {
  return this.edges.length > 0
}

DflowOutput.prototype.isConnected = isConnected

module.exports = DflowOutput

