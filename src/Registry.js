
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
 * @param {String} name identifier of task
 * @param {Function} func to store in registry
 * @param {Object} context
 *
 * @return {Function} func stored in registry
 */

function add (name, func, context) {
  var funcIsUndefined = (typeof func === 'undefined')

  if (registered[name] && funcIsUndefined)
    return registered[name]

  // At this point func was not found in registry
  // so dflow will try to get it from global
  var path = name.split('.')

  var globalName = path[0]
    , propName = path[1]

  if (typeof global[globalName] !== 'undefined' && funcIsUndefined) {
    if (typeof propName !== 'undefined') {
      registered[name] = coerceToFunction(global[globalName][propName])
    }
  }
  else {
    // At this point no func was found in global
    // so if a func was passed as parameter, I assume it should be inserted
    // into the registry.
    // Custom functions in registry will not override global definitions.
   
    registered[name] = coerceToFunction(func)
  }

  // If optional context is provided, bind function to it
  if (typeof context === 'object')
    registered[name] = registered[name].bind(context)

  return registered[name]
}

exports.add = add

/**
 * Retrieve function from dflow registry
 *
 * @param {String} name identifier of task
 *
 * @return {Function} func stored in registry
 */
function get (name) {
  return registered[name]
}

exports.get = get

