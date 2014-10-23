
/**
 * Inject functions to retrieve arguments.
 *
 * @param {Object} funcs
 * @param {Array} tasks
 * @param {Object} args
 *
 * @returns {Object} funcs enriched with arguments[N] funcs
 */

function injectArguments (funcs, tasks, args) {
  function getArgument (index) {
    return args[index]
  }

  function inject (task) {
    var funcName = task.func

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

  tasks.forEach(inject)

  return funcs
}

module.exports = injectArguments

