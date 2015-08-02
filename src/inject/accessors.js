
var accessorRegex = require('../regex/accessor')

var debug = require('debug')('dflow:inject')

/**
 * Inject functions to set or get context keywords.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectAccessors (funcs, graph) {
  debug('accessors')

  if (typeof graph.data === 'undefined')
    graph.data = {}

  /**
   * Inject accessor.
   */

  function inject (taskKey) {
    var accessorName,
        taskName = graph.task[taskKey]

    /**
     * Accessor-like function.
     */

    function accessor () {
      if (arguments.length === 1)
        graph.data[accessorName] = arguments[0]

      return graph.data[accessorName]
    }

    if (accessorRegex.test(taskName)) {
      accessorName = taskName.substring(1)

      funcs[taskName] = accessor
    }
  }

  Object.keys(graph.task).forEach(inject)
}

module.exports = injectAccessors

