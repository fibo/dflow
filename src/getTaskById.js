
function getTaskById (graph, id) {
  var foundTasks = graph.tasks.filter(function (task) {
    return task.id === id
  })

  return foundTasks[0]
}

module.exports = getTaskById

