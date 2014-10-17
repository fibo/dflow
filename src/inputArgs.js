
var inputPipes = require('./inputPipes')

function inputArgs (graph, task) {
  var args = []
    , inputPipesOf = inputPipes.bind(null, graph.pipes)
  
  function populateArg (pipe) {
    var index = pipe.to.arg
      , value = graph.outs[pipe.from.id]

    args[index] = value
  }

  inputPipesOf(task).forEach(populateArg)

  return args
}

module.exports = inputArgs

