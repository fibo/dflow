/**
 * Inject functions that return numbers.
 *
 * @param {Object} funcs reference
 * @param {Object} task collection
 */

function injectNumbers (funcs, task) {
  /**
   * Inject a function that returns a number.
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    var num = parseFloat(taskName)

    if (isNaN(num)) {
      return
    } else {
      funcs[taskName] = function () { return num }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectNumbers
