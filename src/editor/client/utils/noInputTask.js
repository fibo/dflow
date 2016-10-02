const argumentRegex = require('../../../engine/regex/argument')
const quotedRegex = require('../../../engine/regex/quoted')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function noInputTask (taskName) {
  const noInputTasks = ['arguments']

  if (noInputTasks.indexOf(taskName) > -1) return true

  if (argumentRegex.test(taskName)) return true
  if (quotedRegex.test(taskName)) return true

  return false
}
