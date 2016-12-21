import builtinFunctions from '../../../engine/functions/builtin'
import regexAccessor from '../../../engine/regex/accessor'
import regexDotOperator from '../../../engine/regex/dotOperator'
import walkGlobal from '../../../engine/walkGlobal'

/**
 * @param {String} taskName
 * @returns {Boolean}
 */

export default function singleInputTask (taskName) {
  if (regexAccessor.test(taskName)) return true
  if (regexDotOperator.attrRead.test(taskName)) return true

  const builtin = builtinFunctions[taskName]
  if (builtin) return builtin.length === 1

  const globalTask = walkGlobal(taskName)

  if (globalTask && typeof globalTask === 'function') {
    return globalTask.length === 1
  }

  const singleInputTasks = [
    'alert',
    'return',
    't'
  ]

  return singleInputTasks.indexOf(taskName) > -1
}
