
/**
 * Connect outputs to inputs
 *
 * @param {Object} source
 * @param {Object} target
 */

function DflowEdge (source, target) {
  this.source = source

  this.target = target
}

/*!
 * Export
 */

module.exports = DflowEdge

