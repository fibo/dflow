
function getArgument (args, index) {
  return args[index]
}

/**
 * Inject functions to retrieve arguments
 *
 * @param {Object} funcs
 * @param {Array} tasks
 * @param {Object} args
 *
 * @returns {Object} funcs enriched with arguments[N] funcs
 */

function injectArguments (funcs, tasks, args) {
  function inject (task) {
    var funcName = task.func

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    }
    else {
      var argumentsN = /^arguments\[(\d+)\]$/
      var arg = argumentsN.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, args, arg[1])
    }
  }

  tasks.forEach(inject)

  return funcs
}

module.exports = injectArguments

