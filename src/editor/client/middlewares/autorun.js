import fun from '../../../engine/fun'
import validate from '../../../engine/validate'
import additionalFunctions from '../utils/additionalFunctions'
import { invalidNode } from '../actions'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { graph } = store.getState()

    // TODO nothing to do client side if context is *server*
    // if (graph.info && graph.info.context === 'server') return result

    // Check that graph is valid.
    try {
      validate(graph)
    } catch (err) {
      console.error(err)
    }

    // Try to execute graph.
    try {
      // TODO additionalFunctions... how to pass them?
      // TODO how to pass arguments?
      fun(graph, additionalFunctions)()
    } catch (err) {
      if (action.type === 'CREATE_NODE') {
        // Mark node as invalid so it is highlighted in the editor.
        store.dispatch(invalidNode(action.nodeId, err))

        // Create a fake function in order to avoid dflowFun errors.
        additionalFunctions[action.node.text] = Function.prototype
      } else {
        console.error(err)
      }
      // TODO dflowFunction should collect all errors and finally throw them
      // so here it could be possible to catch them and highlight red nodes by their ids.
    }

    return result
  }
}
