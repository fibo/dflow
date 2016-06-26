import fetch from 'isomorphic-fetch'
import no from 'not-defined'

export const ADD_TASK = 'ADD_TASK'

export function addTask (id) {
  return {
    type: ADD_TASK,
    id
  }
}

export const ADD_PIPE = 'ADD_PIPE'

export function addPipe (id) {
  return {
    type: ADD_PIPE,
    id
  }
}

export const FETCH_GRAPH_FAILURE = 'FETCH_GRAPH_FAILURE'

export const FETCH_GRAPH_REQUEST = 'FETCH_GRAPH_REQUEST'

export const FETCH_GRAPH_SUCCESS = 'FETCH_GRAPH_SUCCESS'

function fetchGraph () {
  return (dispatch) => {
    dispatch({
      type: FETCH_GRAPH_REQUEST
    })

    return fetch('/graph')
      .then((response) => response.json())
      .catch((error) => {
        dispatch({
          type: FETCH_GRAPH_FAILURE,
          error
        })
      })
      .then((json) => dispatch(receiveGraph(json)))
  }
}

export function fetchGraphIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchGraph(getState())) {
      return dispatch(fetchGraph())
    }
  }
}

function shouldFetchGraph (state) {
  return no(state.when_downloaded)
}

function receiveGraph (graph) {
  return {
    type: FETCH_GRAPH_SUCCESS,
    graph
  }
}
