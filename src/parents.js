
var inputPipes = require('./inputPipes')

function parents (graph, task) {
  var inputPipesOf = inputPipes.bind(null, graph.pipes)
    , parentTasks = []
    , parentTaskIds = {}

  function rememberParentTaskId (pipe) {

  }

  inputPipesOf(task)
    .forEach(function (pipe) {
      graph.tasks.forEach(function (task) {
        if (pipe.from.id === task.id)
          parentTasks.push(task)
      })
  })

  return parentTasks
}

module.exports = parents

