import emptyGraph from '../../../engine/emptyGraph.json'
import regexSubgraph from '../../../engine/regex/subgraph'
import no from 'not-defined'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { graph } = store.getState()

    const node = action.node

    if (action.type === 'CREATE_NODE' && regexSubgraph.test(node.text)) {
      // Remove first character, i.e. "/"
      const subgraphName = node.text.substring(1)

      // Create an empty subgraph if it does not exists already.
      if (no(graph.func[subgraphName])) {
        graph.func[subgraphName] = Object.assign({}, emptyGraph)
      }

      // TODO how to delete a subgraph?
    }

    return result
  }
}
