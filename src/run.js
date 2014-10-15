
var inputPipesOf = require('./inputPipesOf')

function run (graph, funcs, task) {
  var taskFunc = funcs[task[func]]
  // TODO get args running parent tasks
  // read also graph arguments
  var taskArgs = []
      
  taskFunc.apply(null, taskArgs)
}

module.exports = run

