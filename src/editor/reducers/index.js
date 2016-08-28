import {
  FETCH_GRAPH_FAILURE,
  FETCH_GRAPH_REQUEST,
  FETCH_GRAPH_SUCCESS
} from '../actions'

import emptyGraph from '../../engine/emptyGraph.json'
import emptyView from 'flow-view/util/emptyView'

const initialState = Object.assign({},
  emptyGraph,
  { view: emptyView }
)

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_GRAPH_FAILURE:
      return state

    case FETCH_GRAPH_REQUEST:
      return state

    case FETCH_GRAPH_SUCCESS:
      return Object.assign({}, state, action.graph)

    default:
      return state
  }
}
