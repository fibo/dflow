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
   */

  function inject (taskKey) {
    var accessorName = null
    var taskName = graph.task[taskKey]

    /**
     * Accessor-like function.
     */

    function accessor () {
      if (arguments.length === 1) {
        graph.data[accessorName] = arguments[0]
      }

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
