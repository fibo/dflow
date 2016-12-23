import builtinFunctions from '../../../engine/functions/builtin'
import regexDotOperator from '../../../engine/regex/dotOperator'
import walkGlobal from '../../../engine/walkGlobal'
import processFunctions from '../../../engine/functions/process'
import windowFunctions from '../../../engine/functions/window'

/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function twoInputsTask (taskName) {
  if (regexDotOperator.func.test(taskName)) return true
  if (regexDotOperator.attrWrite.test(taskName)) return true

  const builtinFun = builtinFunctions[taskName]
  if (builtinFun) return builtinFun.length === 2

  const processFun = processFunctions[taskName]
  if (processFun) return processFun.length === 2

  const windowFun = windowFunctions[taskName]
  if (windowFun) return windowFun.length === 2

  const globalTask = walkGlobal(taskName)

  if (globalTask && typeof globalTask === 'function') {
    return globalTask.length === 2
  }

  return false
}
