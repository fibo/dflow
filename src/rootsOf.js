
var inputPipesOf = require('./inputPipesOf')

function rootsOf (graph) {
  function ifHasNotInputPipes (task) {
    return inputPipesOf(graph.pipes, task).length === 0
  }

  return graph.tasks.filter(ifHasNotInputPipes)
}

module.exports = rootsOf

