
var debug = require('./debug')('dflow:level')

var parents = require('./parents')

/**
 * Compute level of task.
 *
 * @param {Object} pipe
 * @param {Object} cachedLevelOf
 * @param {String} taskKey
 *
 * @returns {Number} taskLevel
 */

function level (pipe, cachedLevelOf, taskKey) {
  var taskLevel = 0
    , parentsOf = parents.bind(null, pipe)

  if (typeof cachedLevelOf[taskKey] === 'number')
    return cachedLevelOf[taskKey]

  function computeLevel (parentTaskKey) {
                                 // ↓ Recursion here: the level of a task is the max level of its parents + 1.
    taskLevel = Math.max(taskLevel, level(pipe, cachedLevelOf, parentTaskKey) + 1)
  }

  parentsOf(taskKey).forEach(computeLevel)

  debug('task "' + taskKey + '" has level ' + taskLevel)

  cachedLevelOf[taskKey] = taskLevel

  return taskLevel
}

module.exports = level

