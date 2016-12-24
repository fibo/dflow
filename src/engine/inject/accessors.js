var no = require('not-defined')
var regexAccessor = require('../regex/accessor')

/**
 * Inject functions to set or get graph data.
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectAccessors (funcs, graph) {
  if (no(graph.data)) graph.data = {}

  funcs['this.graph.data'] = function () { return graph.data }

  /**
   * Inject accessor.
   *
   * @param {String} taskKey
   */

  function inject (taskKey) {
    var accessorName = null
    var taskName = graph.task[taskKey]

    /**
     * Accessor-like function.
     *
     * @param {*} data that JSON can serialize
     */

    function accessor (data) {
      // Behave like a setter if an argument is provided.
      if (arguments.length === 1) {
        var json = JSON.stringify(data)

        if (no(json)) {
          throw new Error('JSON do not serialize data:' + data)
        }

        graph.data[accessorName] = data
      }

      // Always behave also like a getter.
      return graph.data[accessorName]
    }

    if (regexAccessor.test(taskName)) {
      accessorName = taskName.substring(1)

      funcs[taskName] = accessor
    }
  }

  Object.keys(graph.task).forEach(inject)
}

module.exports = injectAccessors
