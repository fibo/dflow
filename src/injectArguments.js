
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
  tasks.forEach(function (task) {
    var argumentsN = /^arguments\[(\d+)\]$/
    var arg = argumentsN.exec(task.func)

    if (arg)
      funcs[task.func] = getArgument.bind(null, args, arg[1])
  })

  return funcs
}

module.exports = injectArguments

