
var inputArgsOf = require('./inputArgsOf')

function run (funcs, graph, task) {
  var func = funcs[task.func]

//  if (typeof func !== 'function')
//    throw new TypeError('Not a function:', func)

  var args = inputArgsOf(graph, task)
  
  return func.apply(null, task.args)
}

module.exports = run

