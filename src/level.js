
var parents = require('./parents')

function levelOf (graph, task) {
  var level = 0
    , parentsOf = parents.bind(null, graph)

  function computeLevel (parentTask) {
    level = Math.max(level, levelOf(graph, parentTask) + 1)
  }

  parentsOf(task).forEach(computeLevel)

  return level
}

module.exports = levelOf

