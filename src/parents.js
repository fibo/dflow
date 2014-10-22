
var inputPipes = require('./inputPipes')

/**
 * Compute parent tasks
 *
 * @param {Array} pipes of graph
 * @param {Array} tasks of graph
 * @param {String} taskKey
 *
 * @returns {Array} parentTasks
 */

function parents (pipes, tasks, taskKey) {
  var inputPipesOf = inputPipes.bind(null, pipes)
    , parentTaskIds = {}

  function rememberParentTaskId (pipe) {
    parentTaskIds[pipe.from] = true
  }

  inputPipesOf(taskKey).forEach(rememberParentTaskId)

  function parentTasks (task) {
    return parentTaskIds[task.key] === true 
  }

  return tasks.filter(parentTasks)
}

module.exports = parents

