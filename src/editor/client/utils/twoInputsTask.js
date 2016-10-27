const regexDotOperator = require('../../../engine/regex/dotOperator')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function twoInputsTask (taskName) {
  if (regexDotOperator.attr(taskName)) return true
  if (regexDotOperator.func(taskName)) return true

  return false
}
