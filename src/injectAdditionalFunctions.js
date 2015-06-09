
function injectAdditionalFunctions (funcs, additionalFunctions) {

  /**
   * Validate and insert an additional function.
   */

  function injectAdditionalFunction (key) {
    var isAFunction = typeof additionalFunctions[key] === 'function'

    if (isAFunction)
      funcs[key] = additionalFunctions[key]
  }

  if (typeof additionalFunctions === 'object')
    Object.keys(additionalFunctions)
          .forEach(injectAdditionalFunction)
}

module.exports = injectAdditionalFunctions

