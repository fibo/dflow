var validate = require('./validate')

/**
 * Duct tape for dflow functions.
 *
 * @param {Function} f
 *
 * @returns {Boolean} ok, it looks like a dflowFun
 */

function isDflowFun (f) {
  var isFunction = typeof f === 'function'
  var hasGraphObject = typeof f.graph === 'object'
  var hasFuncsObject = typeof f.funcs === 'object'
  var hasValidGraph = false

  if (isFunction && hasGraphObject && hasFuncsObject) {
    hasValidGraph = validate(f.graph, f.funcs)
  }

  return hasValidGraph
}

module.exports = isDflowFun
