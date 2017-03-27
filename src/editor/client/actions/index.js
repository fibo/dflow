import no from 'not-defined'

import {
  get,
  prepareRequest,
  put
} from '../utils/fetch'

export const createLink = (link, linkId) => ({
  type: 'CREATE_LINK',
  link,
  linkId
})

export const createNode = (node, nodeId) => ({
  type: 'CREATE_NODE',
  node,
  nodeId
})

export const deleteLink = (linkId) => ({
  type: 'DELETE_LINK',
  linkId
})

export const deleteNode = (nodeId) => ({
  type: 'DELETE_NODE',
  nodeId
})

export const disableAutorun = () => ({
  type: 'DISABLE_AUTORUN'
})

export const enableAutorun = () => ({
  type: 'ENABLE_AUTORUN'
})

export const invalidNode = (nodeId, error) => ({
  type: 'INVALID_NODE',
  nodeId,
  error
})

export const openExample = (graph) => ({
  type: 'OPEN_EXAMPLE',
  graph
})

function readGraph () {
  return (dispatch) => {
    const { receiveData, responseFailure } = prepareRequest(dispatch, 'READ_GRAPH')

    return get('/graph')
      .then(receiveData)
      .catch(responseFailure)
  }
}

export function readGraphIfNeeded () {
  return (dispatch, getState) => {
    if (shouldReadGraph(getState())) {
      return dispatch(readGraph())
    }
  }
}

export const runOnce = () => ({
  type: 'RUN_ONCE'
})

export function updateGraph (graph) {
  return (dispatch) => {
    const { receiveData, responseFailure } = prepareRequest(dispatch, 'UPDATE_GRAPH')

    return put('/graph', graph)
      .then(receiveData)
      .catch(responseFailure)
  }
}

function shouldReadGraph (state) {
  return no(state.when_downloaded)
}
