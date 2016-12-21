var regexQuoted = require('./regex/quoted')

var globalContext

if (typeof window === 'object') {
  globalContext = window
}

if (typeof global === 'object') {
  globalContext = global
}

/**
 * Walk through global context.
 *
 * process.version will return global[process][version]
 *
 * @param {String} taskName
 * @returns {*} leaf
 */

function walkGlobal (taskName) {
  // Skip dot operator and tasks that start with a dot.
  if (taskName.indexOf('.') === 0) return

  // Skip strings and numbers which may include dots.
  if (regexQuoted.test(taskName)) return
  if (parseFloat(taskName)) return

  function toNextProp (next, prop) {
    return next[prop]
  }

  return taskName.split('.')
                 .reduce(toNextProp, globalContext)
}

module.exports = walkGlobal
