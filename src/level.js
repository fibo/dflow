
var parents = require('./parents')

/**
 * Compute level of task.
 *
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Number} taskLevel
 */

function level (pipe, taskKey) {
  var taskLevel = 0
    , parentsOf = parents.bind(null, pipe)

  function computeLevel (parentTaskKey) {
                                 // ↓ Recursion here: the level of a task is the max level of its parents + 1.
    taskLevel = Math.max(taskLevel, level(pipe, parentTaskKey) + 1)
  }

  parentsOf(taskKey).forEach(computeLevel)

  return taskLevel
}

module.exports = level

