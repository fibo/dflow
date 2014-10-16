
var inputPipesOf = require('./inputPipesOf')

function inputArgsOf (graph, task) {
  var args = []
    , index
    , value
  
  function populateArg (pipe) {
    value = graph.outs[pipe.to.id]
    index = pipe.to.arg
    args[index] = value
  }

  inputPipesOf(graph.pipes, task).forEach(populateArg)

  return args
}

module.exports = inputArgsOf

