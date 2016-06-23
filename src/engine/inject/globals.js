var notDefined = require('not-defined')
var reservedKeys = require('../reservedKeys')
var walkGlobal = require('../walkGlobal')

/**
 * Inject globals.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectGlobals (funcs, task) {
  /**
   * Inject task
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    // Do not overwrite a function if already defined.
    // For example, console.log cannot be used as is, it must binded to console.
    if (typeof funcs[taskName] === 'function') return

    // Skip also reserved keywords.
    if (reservedKeys.indexOf(taskName) > -1) return

    var globalValue = walkGlobal(taskName)

    if (notDefined(globalValue)) return

    if (typeof globalValue === 'function') {
      funcs[taskName] = globalValue
    } else {
      funcs[taskName] = function () {
        return globalValue
      }
    }
  }

  Object.keys(task)
        .forEach(inject)
}

module.exports = injectGlobals
