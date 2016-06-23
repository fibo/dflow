/**
 * If it contains an `=>`, escape single quotes and eval it.
 *
 * @param {Object} funcs reference
 * @param {Object} task collection
 */

function arrowFunctions (funcs, task) {
  /**
   * Filter tasks that contain an `=>`
   */

  function arrows (taskKey) {
    return (task[taskKey].indexOf('=>') > -1)
  }

  /**
   * Evaluate a task
   */

  function evalTask (taskKey) {
    var taskName = task[taskKey]

    try {
      var f = eval(taskName) // eslint-disable-line
      funcs[taskName] = f
    } catch (ignore) {}
  }

  Object.keys(task)
        .filter(arrows)
        .forEach(evalTask)
}

module.exports = arrowFunctions
