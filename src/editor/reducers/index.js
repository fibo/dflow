import emptyGraph from '../../engine/emptyGraph.json'

const initialState = Object.assign({}, emptyGraph)

export default function (state = initialState, action) {
  var pipe = Object.assign({}, state.pipe)
  var task = Object.assign({}, state.task)
  var view = Object.assign({}, state.view)

  const link = action.link
  const linkId = action.linkId
  const node = action.node
  const nodeId = action.nodeId

  switch (action.type) {
    case 'CREATE_INPUT_PIN':

    case 'CREATE_LINK':
      view.link[linkId] = link

      return Object.assign({}, state, { view })

    case 'CREATE_NODE':
      view.node[nodeId] = node

      return Object.assign({}, state, { view })

    case 'CREATE_OUTPUT_PIN':
      return state

    case 'DELETE_INPUT_PIN':
      return state

    case 'DELETE_LINK':
      delete view.link[linkId]
      delete pipe[linkId]

      return Object.assign({}, state, { view }, { pipe })

    case 'DELETE_NODE':
      return state

    case 'DELETE_OUTPUT_PIN':
      return state

    case 'FETCH_GRAPH_FAILURE':
      return state

    case 'FETCH_GRAPH_REQUEST':
      return state

    case 'FETCH_GRAPH_SUCCESS':
      return Object.assign({}, state, action.graph)

    default:
      return state
  }
}
