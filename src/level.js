
var parents = require('./parents')

/**
 * Compute level of task.
 *
 * @param {Array} pipes
 * @param {Array} tasks
 * @param {String} taskKey
 *
 * @returns {Number} taskLevel
 */

function level (pipes, tasks, taskKey) {
  var taskLevel = 0
    , parentsOf = parents.bind(null, pipes, tasks)

  function computeLevel (parentTask) {
    taskLevel = Math.max(taskLevel, level(pipes, tasks, parentTask.key) + 1)
  }

  parentsOf(taskKey).forEach(computeLevel)

  return taskLevel
}

module.exports = level

