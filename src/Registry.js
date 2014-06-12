
var registered = {}

/**
 * Wrap into a Function
 *
 * @api private
 *
 * @param {Any} arg
 *
 * @return {Function} func
 */

function coerceToFunction (arg) {
  if (typeof arg === 'function')
    return arg
  else
    return function value () { return arg }
}

/**
 * Store function in dflow registry
 *
 * ```
 * dflow.Registry.set('foo', function () { return {bar: 'quz'}})
 * ```
 *
 * @param {String} name identifier of task
 * @param {Function} func to store in registry
 * @param {Object} context
 *
 * @return {Function} func stored in registry
 */

function set (name, func, context) {
    registered[name] = coerceToFunction(func)

  // If optional context is provided, bind function to it
  if (typeof context === 'object')
    registered[name] = registered[name].bind(context)

  return registered[name]
}

exports.set = set

/**
 * Retrieve function from dflow registry
 *
 * @param {String} name identifier of task
 *
 * @return {Function} func stored in registry
 */

function get (name) {
  if (typeof registered[name] === 'function')
    return registered[name]

  // At this point func was not found in registry
  // so dflow will try to get it from global
  var path = name.split('.')

  var globalName = path[0]
    , propName = path[1]

  if (typeof global[globalName] !== 'undefined') {
    if (typeof propName !== 'undefined') {
      return coerceToFunction(global[globalName][propName])
    }
  }
}

exports.get = get

