import builtinFunctions from '../../../engine/functions/builtin'
import regexDotOperator from '../../../engine/regex/dotOperator'
import walkGlobal from '../../../engine/walkGlobal'

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
