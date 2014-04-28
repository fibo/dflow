
var DflowEdge = require('./DflowEdge')
  , DflowSlot = require('./DflowSlot')
  , inherits  = require('inherits')

function DflowOutput () {
  DflowSlot.apply(this, arguments)

  this.edges = []
}

inherits(DflowOutput, DflowSlot)

/*
 * @return {Boolean}
 */

function isConnected () {
  return this.edges.length > 0
}

DflowOutput.prototype.isConnected = isConnected

/*
 * @param {Object} input
 */

function connectTo (input) {
  this.edges.push(new DflowEdge(input, this))
}

DflowOutput.prototype.isConnected = isConnected

module.exports = DflowOutput

