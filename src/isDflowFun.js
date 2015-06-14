
var validate = require('./validate')

/**
 * Duct tape for dflow functions.
 *
 * @param {Function} f
 *
 * @returns {Boolean} ok, it looks like a dflowFun
 */

function isDflowFun (f) {
  var isFunction     = typeof f === 'function',
      hasGraphObject = typeof f.graph === 'object',
      hasFuncsObject = typeof f.funcs === 'object',
      hasValidGraph  = false

  if (isFunction && hasGraphObject && hasFuncsObject)
    hasValidGraph = validate(f.graph, f.funcs)

  return hasValidGraph
}

module.exports = isDflowFun

