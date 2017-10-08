import { Canvas } from 'flow-view'
import CanvasContainer from '../components/CanvasContainer'
import InvalidNode from '../components/InvalidNode'
import SubgraphNode from '../components/SubgraphNode'
import ToggleNode from '../components/ToggleNode'
import {
  createLink,
  createNode,
  deleteLink,
  deleteNode
} from '../actions'

import typeOfNode from '../utils/typeOfNode'

var flowViewCanvas = null

export default function canvasMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    if (action.type === 'READ_GRAPH_SUCCESS') {
      const graph = action.data

      const data = graph.data
      const pipe = graph.pipe
      const task = graph.task
      const view = graph.view

      flowViewCanvas = new Canvas(CanvasContainer.defaultProps.id, {
        node: {
          InvalidNode,
          SubgraphNode,
          ToggleNode
        },
        util: { typeOfNode }
      })

      flowViewCanvas.render(view, { data, pipe, task })

      flowViewCanvas.on('createNode', (node, nodeId) => {
        store.dispatch(createNode(node, nodeId))
      })

      flowViewCanvas.on('createLink', (link, linkId) => {
        store.dispatch(createLink(link, linkId))
      })

      flowViewCanvas.on('deleteLink', (linkId) => {
        store.dispatch(deleteLink(linkId))
      })

      flowViewCanvas.on('deleteNode', (nodeId) => {
        store.dispatch(deleteNode(nodeId))
      })
    }

    if (flowViewCanvas) {
      switch (action.type) {
        case 'OPEN_EXAMPLE':
          const exampleGraph = action.graph

          flowViewCanvas.render(exampleGraph.view, {
            data: exampleGraph.data,
            pipe: exampleGraph.pipe,
            task: exampleGraph.task
          })

          break
      }
    }

    return result
  }
}
