
/**
 * Inject globals.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectGlobals (funcs, task) {
  function inject (taskKey) {
    var taskName = task[taskKey]

    // Do not overwrite a function if already defined.
    // For example, console.log cannot be used as is, it must binded to console.
    if (typeof funcs[taskName] === 'function')
      return

    // Skip also reserved keywords.
    if (taskName === 'return')
      return

    var globalContext

    if (typeof window === 'object')
      globalContext = window

    if (typeof global === 'object')
      globalContext = global

    /**
     * Walk through global context.
     *
     * process.version will return global[process][version]
     *
     * @param {String} taskName
     * @returns {*} leaf
     */

    function walk (taskName) {
      function toNextProp (leaf, prop) { return leaf[prop] }

      return taskName.split('.')
                     .reduce(toNextProp, globalContext)
    }

    var globalValue = walk(taskName)

    if (typeof globalValue === 'undefined')
      return

    if (typeof globalValue === 'function')
      funcs[taskName] = globalValue
    else
      funcs[taskName] = function () { return globalValue }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectGlobals

