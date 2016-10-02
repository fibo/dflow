import { Canvas } from 'flow-view'
import Inspector from '../components/Inspector'
import {
  createLink,
  createNode,
  deleteLink,
  deleteNode
} from '../actions'

var flowViewCanvas = null

export default function canvasMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    if (action.type === 'FETCH_GRAPH_SUCCESS') {
      flowViewCanvas = new Canvas(action.canvasId, {
        inspector: {
          DefaultInspector: Inspector
        }
      })

      flowViewCanvas.render(action.graph.view)

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
        case 'TODO_ACTION':
          // TODO flowViewCanvas.doSomething()
          // for example set node state to error to make it red.
          break
      }
    }

    return result
  }
}
