
/**
 * Inject references to functions.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {
  function inject (taskKey) {
    var referenceName
      , referenceRegex = /^\&(.+)$/
      , taskName = task[taskKey]

    if (referenceRegex.test(taskName)) {
      referenceName = taskName.substring(1)

      function reference () {
        return funcs[referenceName]
      }

      funcs[taskName] = reference
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences

