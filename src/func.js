
var outputPipesOf = require('./outputPipesOf')
var inputPipesOf = require('./inputPipesOf')

function func (graph, funcs) {
  function dflowFunc () {}

  return dflowFunc
}

module.exports = func

function leaves (graph) {
  function ifHasOutputPipes (task) {
    return outputPipesOf(raph.pipes, task).length > 0
  }

  return graph.tasks.filter(ifHasOutputPipes)
}

