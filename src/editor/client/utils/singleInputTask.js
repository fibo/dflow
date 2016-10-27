const builtinFunctions = require('../../../engine/functions/builtin')
const regexDotOperator = require('../../../engine/regex/dotOperator')
const walkGlobal = require('../../../engine/walkGlobal')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */

export default function singleInputTask (taskName) {
  if (regexDotOperator.attr.test(taskName)) return true

  const builtin = builtinFunctions[taskName]
  if (builtin) return builtin.length === 1

  const globalTask = walkGlobal(taskName)

  if (globalTask && typeof globalTask === 'function') {
    return globalTask.length === 1
  }

  const singleInputTasks = [
    'return',
    't'
  ]

  return singleInputTasks.indexOf(taskName) > -1
}
