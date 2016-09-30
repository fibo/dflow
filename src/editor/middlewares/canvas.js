import { Canvas } from 'flow-view'
import {
  createLink,
  createNode,
  createInputPin,
  createOutputPin,
  deleteInputPin,
  deleteOutputPin,
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

      flowViewCanvas.on('createInputPin', (nodeId, position, pin) => {
        store.dispatch(createInputPin(nodeId, position, pin))
      })

      flowViewCanvas.on('createOutputPin', (nodeId, position, pin) => {
        store.dispatch(createOutputPin(nodeId, position, pin))
      })

      flowViewCanvas.on('deleteLink', (linkId) => {
        store.dispatch(deleteLink(linkId))
      })

      flowViewCanvas.on('deleteNode', (nodeId) => {
        store.dispatch(deleteNode(nodeId))
      })

      flowViewCanvas.on('deleteInputPin', (nodeId, position) => {
        store.dispatch(deleteInputPin(nodeId, position))
      })

      flowViewCanvas.on('deleteOutputPin', (nodeId, position) => {
        store.dispatch(deleteOutputPin(nodeId, position))
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
