import additionalFunctions from '../utils/additionalFunctions'
import fun from '../../../engine/fun'
import {
  disableAutorun,
  invalidNode
} from '../actions'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { editor, graph } = store.getState()

    if (!editor.autorun) return result

    // TODO nothing to do client side if context is *server*
    // if (graph.info && graph.info.context === 'server') return result

    // TODO additionalFunctions... how to pass them?
    // they could be passed by server as a funcs.js script in DOM
    // TODO how to pass arguments?
    var dflowFun

    // Try to compile graph.

    try {
      dflowFun = fun(graph, additionalFunctions)
    } catch (err) {
      store.dispatch(disableAutorun())

      if (err.taskKey) {
        // Mark node as invalid so it is highlighted in the editor.
        store.dispatch(invalidNode(err.taskKey, err))
      }

      console.error(err)
    }

    // Try to execute graph.

    try {
      dflowFun()
    } catch (err) {
      store.dispatch(disableAutorun())

      if (err.taskKey) {
        // Mark node as invalid so it is highlighted in the editor.
        store.dispatch(invalidNode(err.taskKey, err))
      }

      // TODO do the following if an **ignore errors** flag is active.
      // Create a fake function in order to avoid dflowFun errors.
      // additionalFunctions[node.text] = Function.prototype
      console.error(err)
    }

    return result
  }
}
