import builtinFunctions from '../../../engine/functions/builtin'
import regexDotOperator from '../../../engine/regex/dotOperator'
import walkGlobal from '../../../engine/walkGlobal'

/**
 * @param {String} taskName
 * @returns {Boolean}
 */

export default function singleInputTask (taskName) {
  if (regexDotOperator.attr.test(taskName)) return true
  if (regexDotOperator.func.test(taskName)) return false

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
