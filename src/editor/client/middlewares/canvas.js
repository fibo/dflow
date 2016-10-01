import { Canvas } from 'flow-view'
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
    const state = store.getState()

    if (action.type === 'INIT_CANVAS') {
      flowViewCanvas = new Canvas(action.canvasId)

      flowViewCanvas.render(state.view)

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
          // for example set a node to error state.
          break
      }
    }

    return result
  }
}
