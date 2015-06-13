
var referenceRegex = require('./regex/reference')

/**
 * Inject references to functions.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {
  function inject (taskKey) {
    var referenceName,
        taskName       = task[taskKey]

    function reference () {
      return funcs[referenceName]
    }

    if (referenceRegex.test(taskName)) {
      referenceName = taskName.substring(1)

      funcs[taskName] = reference
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences

