const builtinFunctions = require('../../../engine/functions/builtin')
const regexDotOperator = require('../../../engine/regex/dotOperator')
const walkGlobal = require('../../../engine/walkGlobal')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function twoInputsTask (taskName) {
  if (regexDotOperator.func.test(taskName)) return true

  const builtin = builtinFunctions[taskName]
  if (builtin) return builtin.length === 2

  const globalTask = walkGlobal(taskName)

  if (globalTask && typeof globalTask === 'function') {
    return globalTask.length === 2
  }

  return false
}
