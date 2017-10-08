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

      if (obj) func = obj[attributeName]

      if (typeof func === 'function') {
        return func.apply(obj, Array.prototype.slice.call(arguments, 2))
      }
    }

    if (regexDotOperator.func.test(taskName)) {
                                                   // .foo() -> foo
      funcs[taskName] = dotOperatorFunc.bind(null, taskName.substring(1, taskName.length - 2))
    }

    /**
     * Dot operator attribute write.
     *
     * @param {String} attributeName
     * @param {Object} obj
     * @param {*} attributeValue
     *
     * @returns {Object} obj modified
     */

    function dotOperatorAttributeWrite (attributeName, obj, attributeValue) {
      obj[attributeName] = attributeValue

      return obj
    }

    if (regexDotOperator.attrWrite.test(taskName)) {
                                                             // .foo= -> foo
      funcs[taskName] = dotOperatorAttributeWrite.bind(null, taskName.substring(1, taskName.length - 1))
    }

    /**
     * Dot operator attribute read.
     *
     * @param {String} attributeName
     * @param {Object} obj
     *
     * @returns {*} attribute
     */

    function dotOperatorAttributeRead (attributeName, obj) {
      var attr

      if (obj) attr = obj[attributeName]

      if (typeof attr === 'function') return attr.bind(obj)

      return attr
    }

    if (regexDotOperator.attrRead.test(taskName)) {
                                                            // .foo -> foo
      funcs[taskName] = dotOperatorAttributeRead.bind(null, taskName.substring(1))
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectDotOperators
