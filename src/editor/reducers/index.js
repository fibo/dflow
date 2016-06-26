import {
  FETCH_GRAPH_FAILURE,
  FETCH_GRAPH_REQUEST,
  FETCH_GRAPH_SUCCESS
} from '../actions'
import viewActions from 'flow-view/actions'
import viewReducers from 'flow-view/reducers'

import emptyGraph from '../../engine/emptyGraph.json'
import viewInitialState from 'flow-view/util/initialState'

const initialState = Object.assign({},
  emptyGraph,
  { view: viewInitialState }
)

export default function (state = initialState, action) {
  let view = Object.assign({}, state.view)

  if (viewActions.includes(action.type)) {
    view = viewReducers(state.view, action)
  }

  switch (action.type) {
    case viewActions.ADD_NODE:
      return state

    case FETCH_GRAPH_FAILURE:
      return state

    case FETCH_GRAPH_REQUEST:
      return state

    case FETCH_GRAPH_SUCCESS:
      return Object.assign({}, state, action.graph)

    default:
      return Object.assign({}, state, { view })
  }
}
