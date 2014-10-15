
var outputPipesOf = require('./outputPipesOf')
  , run = require('./run')

function func (graph, funcs) {
  function ifHasOutputPipes (task) {
    return outputPipesOf(graph.pipes, task).length > 0
  }

  var leaves = graph.tasks.filter(ifHasOutputPipes)

  function dflowFunc () {
    var runTask = run.bind(graph, funcs)

    leaves.forEach(runTask)
  }

  return dflowFunc
}

module.exports = func

