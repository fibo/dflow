import { Canvas } from 'flow-view'
import Inspector from '../components/Inspector'
import InvalidNode from '../components/InvalidNode'
import ToggleNode from '../components/ToggleNode'
import { Node } from 'flow-view/components'
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

    if (action.type === 'FETCH_GRAPH_SUCCESS') {
      const graph = action.graph

      const data = graph.data
      const pipe = graph.pipe
      const task = graph.task
      const view = graph.view

      flowViewCanvas = new Canvas(action.canvasId, {
        inspector: {
          DefaultInspector: Inspector
        },
        node: {
          DefaultNode: Node,
          InvalidNode,
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
        case 'TODO_ACTION':
          // TODO flowViewCanvas.doSomething()
          // for example set node state to error to make it red.
          break
      }
    }

    return result
  }
}
