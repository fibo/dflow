
var DflowEdge = require('./DflowEdge')
  , DflowSlot = require('./DflowSlot')
  , inherits  = require('inherits')

function DflowInput () {
  DflowSlot.apply(this, arguments)

  this.edge = null
}

inherits(DflowInput, DflowSlot)

/**
 * @return {Boolean}
 */
function isConnected () {
  return this.edge instanceof DflowEdge
}

DflowInput.prototype.isConnected = isConnected

/**
 * @param {Object} output
 */
function connectTo (output) {
  this.edge = new DflowEdge(this, output)
}

DflowInput.prototype.connectTo = connectTo

module.exports = DflowInput

