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

export function createInputPin (nodeId, position, pin) {
  return {
    type: 'CREATE_INPUT_PIN',
    nodeId,
    position,
    pin
  }
}

export function createOutputPin (nodeId, position, pin) {
  return {
    type: 'CREATE_OUTPUT_PIN',
    nodeId,
    position,
    pin
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

export function deleteInputPin (nodeId, position) {
  return {
    type: 'DELETE_INPUT_PIN',
    nodeId,
    position
  }
}

export function deleteOutputPin (nodeId, position) {
  return {
    type: 'DELETE_OUTPUT_PIN',
    nodeId,
    position
  }
}

function fetchGraph () {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_GRAPH_REQUEST'
    })

    return fetch('/graph')
      .then((response) => response.json())
      .catch((error) => {
        dispatch({
          type: 'FETCH_GRAPH_FAILURE',
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

export function initCanvas (canvasId) {
  return {
    type: 'INIT_CANVAS',
    canvasId
  }
}

function receiveGraph (graph) {
  return {
    type: 'FETCH_GRAPH_SUCCESS',
    graph
  }
}

function shouldFetchGraph (state) {
  return no(state.when_downloaded)
}
