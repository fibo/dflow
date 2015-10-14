
    var globalContext

    if (typeof window === 'object')
      globalContext = window

    if (typeof global === 'object')
      globalContext = global

    /**
     * Walk through global context.
     *
     * process.version will return global[process][version]
     *
     * @param {String} taskName
     * @returns {*} leaf
     */

    function walkGlobal (taskName) {
      function toNextProp (leaf, prop) { return leaf[prop] }

      return taskName.split('.')
                     .reduce(toNextProp, globalContext)
    }

module.exports = walkGlobal

