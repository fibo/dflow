
var debug = require('../debug').inject

/**
 * @params {Object} funcs
 * @params {Object} additionalFunctions
 */

function injectAdditionalFunctions (funcs, additionalFunctions) {
  // Nothing to do if no additional function is given.
  if (typeof additionalFunctions === 'undefined')
    return

  debug(Object.keys(additionalFunctions).length + ' additionalFunctions')

  /**
   * Validate and insert an additional function.
   */

  function injectAdditionalFunction (key) {
    var isAFunction  = typeof additionalFunctions[key] === 'function'

    if (isAFunction)
      funcs[key] = additionalFunctions[key]
  }

  Object.keys(additionalFunctions)
        .forEach(injectAdditionalFunction)
}

module.exports = injectAdditionalFunctions

