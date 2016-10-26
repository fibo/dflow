var regexDotOperator = require('../regex/dotOperator')

/**
 * Inject functions that emulate dot operator.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectDotOperators (funcs, task) {
  /**
   * Inject dot operator.
   */

  function inject (taskKey) {
    var taskName = task[taskKey]

    /**
     * Dot operator function.
     *
     * @param {String} attributeName
     * @param {Object} obj
     * @param {...} rest of arguments
     *
     * @returns {*} result
     */

    function dotOperatorFunc (attributeName, obj) {
      var func

      if (typeof obj === 'object') {
        func = obj[attributeName]
      }

      if (typeof func === 'function') {
        return func.apply(obj, Array.prototype.slice.call(arguments, 2))
      }
    }

    if (regexDotOperator.func.test(taskName)) {
      // .foo() -> foo
      var attributeName = taskName.substring(1, taskName.length - 2)

      funcs[taskName] = dotOperatorFunc.bind(null, attributeName)
    }

    /**
     * Dot operator attribute.
     *
     * @param {String} attributeName
     * @param {Object} obj
     *
     * @returns {*} attribute
     */

    function dotOperatorAttr (attributeName, obj) {
      var attr

      if (typeof obj === 'object') {
        attr = obj[attributeName]
      }

      if (typeof attr === 'function') {
        return attr.bind(obj)
      }

      return attr
    }

    if (regexDotOperator.attr.test(taskName)) {
      // .foo -> foo
      attributeName = taskName.substring(1)

      funcs[taskName] = dotOperatorAttr.bind(null, attributeName)
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectDotOperators
