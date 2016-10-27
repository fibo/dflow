const builtinFunctions = require('../../../engine/functions/builtin')

/**
 * @param {String} taskName
 * @returns {Boolean}
 */

export default function threeInputsTask (taskName) {
  const builtin = builtinFunctions[taskName]
  if (builtin) return builtin.length === 3

  return false
}
