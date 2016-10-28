import additionalFunctions from '../utils/additionalFunctions'
import emptyGraph from '../../../engine/emptyGraph.json'
import fun from '../../../engine/fun'
import { invalidNode } from '../actions'
import regexSubgraph from '../../../engine/regex/subgraph'
import validate from '../../../engine/validate'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { graph } = store.getState()

    const node = action.node

    // TODO nothing to do client side if context is *server*
    // if (graph.info && graph.info.context === 'server') return result

    if (regexSubgraph.test(node.text)) {
      // Remove first character, i.e. "/"
      const subgraphName = node.text.substring(1)

      graph.func[subgraphName] = Object.assign({}, emptyGraph)
    }

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
