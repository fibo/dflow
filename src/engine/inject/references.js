var regexReference = require('../regex/reference')
var walkGlobal = require('../walkGlobal')

/**
* Inject references to functions.
*
* @param {Object} funcs reference
* @param {Object} task
*/

function injectReferences (funcs, task) {
  /**
   * Inject task.
   *
   * @param {String} taskKey
   */

  function inject (taskKey) {
    var referenceName = null
    var referencedFunction = null
    var taskName = task[taskKey]

    /**
     * Inject reference.
     */

    function reference () {
      return referencedFunction
    }

    if (regexReference.test(taskName)) {
      referenceName = taskName.substring(1)

      if (typeof funcs[referenceName] === 'function') {
        referencedFunction = funcs[referenceName]
      } else {
        referencedFunction = walkGlobal(referenceName)
      }

      if (typeof referencedFunction === 'function') {
        funcs[taskName] = reference
      }
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences
