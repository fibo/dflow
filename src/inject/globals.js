
var debug      = require('../debug').inject,
    walkGlobal = require('../walkGlobal')

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
    if ((taskName === 'return') || (taskName === 'this.graph'))
      return

    var globalValue = walkGlobal(taskName)

    if (typeof globalValue === 'undefined')
      return

    debug('global ' + taskName)

    if (typeof globalValue === 'function')
      funcs[taskName] = globalValue
    else
      funcs[taskName] = function () { return globalValue }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectGlobals

