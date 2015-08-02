
var argumentRegex = require('../regex/argument')

var debug = require('debug')('dflow:inject')

/**
 * Inject functions to retrieve arguments.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 * @param {Object} args
 */

function injectArguments (funcs, task, args) {
  debug('arguments')

  function getArgument (index) {
    return args[index]
  }

  /**
   * Inject arguments.
   */

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    }
    else {
      var arg = argumentRegex.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, arg[1])
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectArguments

