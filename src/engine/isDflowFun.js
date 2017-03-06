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
  var hasFuncsObject = typeof f.funcs === 'object'
  var hasGraphObject = typeof f.graph === 'object'
  var hasValidGraph = true

  if (!isFunction || !hasFuncsObject || !hasGraphObject) return false

  if (isFunction && hasGraphObject && hasFuncsObject) {
    try {
      validate(f.graph, f.funcs)
    } catch (ignore) {
      hasValidGraph = false
    }
  }

  return hasValidGraph
}

module.exports = isDflowFun
