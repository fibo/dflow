import additionalFunctions from '../utils/additionalFunctions'
import fun from '../../../engine/fun'
import { invalidNode } from '../actions'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { editor, graph } = store.getState()

    if (!editor.autorun) return result

    const node = action.node
    const CREATE_NODE = (action.type === 'CREATE_NODE')

    // TODO nothing to do client side if context is *server*
    // if (graph.info && graph.info.context === 'server') return result

    // Try to execute graph.

    try {
      // TODO additionalFunctions... how to pass them?
      // TODO how to pass arguments?
      fun(graph, additionalFunctions)()
    } catch (err) {
      if (CREATE_NODE) {
        // TODO if it is an invalid task get node id, or node ids
        // then mark as error those nodes.

        // Mark node as invalid so it is highlighted in the editor.
        store.dispatch(invalidNode(action.nodeId, err))

        // Create a fake function in order to avoid dflowFun errors.
        additionalFunctions[node.text] = Function.prototype
      } else {
        console.error(err)
      }
      // TODO dflowFunction should collect all errors and finally throw them
      // so here it could be possible to catch them and highlight red nodes by their ids.
    }

    return result
  }
}
