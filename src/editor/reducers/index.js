import {
  FETCH_GRAPH_FAILURE,
  FETCH_GRAPH_REQUEST,
  FETCH_GRAPH_SUCCESS
} from '../actions'

export default function (state, action) {
  switch (action.type) {
    case FETCH_GRAPH_FAILURE:
      return state

    case FETCH_GRAPH_REQUEST:
      return state

    case FETCH_GRAPH_SUCCESS:
      return state

    default:
      return state
  }
}
