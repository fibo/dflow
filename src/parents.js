
var inputPipes = require('./inputPipes')

function parents (graph, task) {
  var inputPipesOf = inputPipes.bind(null, graph.pipes)
    , parentTaskIds = {}

  function rememberParentTaskId (pipe) {
    parentTaskIds[pipe.from.key] = true
  }

  inputPipesOf(task).forEach(rememberParentTaskId)

  function parentTasks (task) {
    return parentTaskIds[task.key] === true 
  }

  return graph.tasks.filter(parentTasks)
}

module.exports = parents

