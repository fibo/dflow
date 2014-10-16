
function getArgument (args, index) {
  return args[index]
}

function injectArguments (funcs, graph, args) {
  graph.tasks.forEach(function (task) {
    var argumentsN = /^arguments\[(\d+)\]$/
    var arg = argumentsN.exec(task.func)

    if (arg) {
      funcs[task.func] = getArgument.bind(null, args, arg[1])
    }
  })

  return funcs
}

module.exports = injectArguments

