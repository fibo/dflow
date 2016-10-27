const builtinFunctions = require('../../../engine/functions/builtin')
const regexArgument = require('../../../engine/regex/argument')
const regexReference = require('../../../engine/regex/reference')
const regexQuoted = require('../../../engine/regex/quoted')
const walkGlobal = require('../../../engine/walkGlobal')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function noInputTask (taskName) {
  if (taskName === 'console.log') return false

  if (regexArgument.test(taskName)) return true
  if (regexReference.test(taskName)) return true
  if (regexQuoted.test(taskName)) return true
  if (!isNaN(parseFloat(taskName))) return true

  const builtin = builtinFunctions[taskName]
  if (builtin) return builtin.length === 0

  const globalTask = walkGlobal(taskName)

  if (globalTask) {
    if (typeof globalTask === 'function') return globalTask.length === 0
    else return true
  }

  const noInputTasks = [
    'arguments',
    'body',
    'document',
    'Infinity'
  ]

  return noInputTasks.indexOf(taskName) > -1
}
