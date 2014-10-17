
var parents = require('./parents')

function level (graph, task) {
  var taskLevel = 0
    , parentsOf = parents.bind(null, graph)

  function computeLevel (parentTask) {
    taskLevel = Math.max(taskLevel, level(graph, parentTask) + 1)
  }

  parentsOf(task).forEach(computeLevel)

  return taskLevel
}

module.exports = level

