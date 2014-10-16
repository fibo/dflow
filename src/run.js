
var inputArgsOf = require('./inputArgsOf')

function run (funcs, graph, task) {
  var func = funcs[task.func]

  var args = inputArgsOf(graph, task)
  
  return func.apply(null, task.args)
}

module.exports = run

