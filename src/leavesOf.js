
var outputPipesOf = require('./outputPipesOf')

function leavesOf (graph) {
  function ifHasNotOutputPipes (task) {
    return outputPipesOf(graph.pipes, task).length === 0
  }

  return graph.tasks.filter(ifHasNotOutputPipes)
}

module.exports = leavesOf

