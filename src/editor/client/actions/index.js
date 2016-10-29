import fetch from 'isomorphic-fetch'
import no from 'not-defined'

export function createNode (node, nodeId) {
  return {
    type: 'CREATE_NODE',
    node,
    nodeId
  }
}

export function createLink (link, linkId) {
  return {
    type: 'CREATE_LINK',
    link,
    linkId
  }
}

export function deleteLink (linkId) {
  return {
    type: 'DELETE_LINK',
    linkId
  }
}

export function deleteNode (nodeId) {
  return {
    type: 'DELETE_NODE',
    nodeId
  }
}

export function disableAutorun () {
  return {
    type: 'DISABLE_AUTORUN'
  }
}

export function enableAutorun (name) {
  return {
    type: 'ENABLE_AUTORUN'
  }
}

function fetchGraph (canvasId) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_GRAPH_REQUEST'
    })

    return fetch('/graph')
      .then((response) => response.json())
      .catch((error) => {
        dispatch({
          type: 'FETCH_GRAPH_FAILURE',
          canvasId,
          error
        })
      })
      .then((json) => dispatch(receiveGraph(json, canvasId)))
  }
}

export function fetchGraphIfNeeded (canvasId) {
  return (dispatch, getState) => {
    if (shouldFetchGraph(getState())) {
      return dispatch(fetchGraph(canvasId))
    }
  }
}

export function invalidNode (nodeId, error) {
  return {
    type: 'INVALID_NODE',
    nodeId,
    error
  }
}

function receiveGraph (graph, canvasId) {
  return {
    type: 'FETCH_GRAPH_SUCCESS',
    canvasId,
    graph
  }
}

function shouldFetchGraph (state) {
  return no(state.when_downloaded)
}
