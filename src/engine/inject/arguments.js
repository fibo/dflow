var argumentRegex = require('../regex/argument')

/**
 * Inject functions to retrieve arguments.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 * @param {Object} args
 */

function injectArguments (funcs, task, args) {
  function getArgument (index) {
    return args[index]
  }

  /**
   * Inject arguments.
   *
   * @api private
   */

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    } else {
      var arg = argumentRegex.exec(funcName)

      if (arg) {
        funcs[funcName] = getArgument.bind(null, arg[1])
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectArguments
