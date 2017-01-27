import { Canvas } from 'flow-view'
import dflow from 'dflow'
import graphs from '../graphs'
import InvalidNode from '../../editor/client/components/InvalidNode'
import ToggleNode from '../../editor/client/components/ToggleNode'
import typeOfNode from '../../editor/client/utils/typeOfNode'
import { Node } from 'flow-view/components'

/**
 * Render example into given div and execute dflow graph.
 *
 * @param {String} divId
 * @param {String} example
 *
 * @returns {undefined}
 */

function renderExample (divId, example) {
  var graph = graphs[example]

  var canvas = new Canvas(divId, {
    node: {
      DefaultNode: Node,
      InvalidNode,
      ToggleNode
    },
    util: { typeOfNode }
  })

  canvas.render(graph.view)

  dflow.fun(graph)()
}

module.exports = renderExample
