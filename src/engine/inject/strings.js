var quotedRegex = require('../regex/quoted')

/**
 * Inject functions that return strings.
 *
 * @param {Object} funcs reference
 * @param {Object} task collection
 */

function injectStrings (funcs, task) {
  /**
   * Inject a function that returns a string.
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    if (quotedRegex.test(taskName)) {
      funcs[taskName] = function () {
        return taskName.substr(1, taskName.length - 2)
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectStrings
