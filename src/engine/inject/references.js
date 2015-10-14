
var referenceRegex = require('../regex/reference'),
    walkGlobal     = require('../walkGlobal')


/**
 * Inject references to functions.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {

  function inject (taskKey) {
    var referenceName,
        referencedFunction,
        taskName = task[taskKey]

    /**
     * Inject reference.
     *
     * @api private
     */

    function reference () {
      return referencedFunction
    }

    if (referenceRegex.test(taskName)) {
      referenceName = taskName.substring(1)

      if (typeof funcs[referenceName] === 'function')
        referencedFunction = funcs[referenceName]
      else
        referencedFunction = walkGlobal(referenceName)

      if (typeof referencedFunction === 'function')
        funcs[taskName] = reference
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences

