
/**
 * Inject functions to retrieve arguments.
 *
 * @param {Object} funcs
 * @param {Object} task
 * @param {Object} args
 *
 * @returns {Object} funcs enriched with arguments[N] funcs
 */

function injectArguments (funcs, task, args) {
  function getArgument (index) {
    return args[index]
  }

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    }
    else {
      var argumentsN = /^arguments\[(\d+)\]$/
      var arg = argumentsN.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, arg[1])
    }
  }

  Object.keys(task).forEach(inject)

  return funcs
}

module.exports = injectArguments

