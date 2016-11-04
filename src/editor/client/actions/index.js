import fetch from 'isomorphic-fetch'
import no from 'not-defined'

import {
  checkStatus,
  parseJSON,
  prepareRequest
} from '../utils/fetch'

export const createNode = (node, nodeId) => ({
  type: 'CREATE_NODE',
  node,
  nodeId
})

export const createLink = (link, linkId) => ({
  type: 'CREATE_LINK',
  link,
  linkId
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

function fetchGraph () {
  return (dispatch) => {
    const { receiveData, responseFailure } = prepareRequest(dispatch, 'FETCH_GRAPH')

    return fetch('/graph')
      .then(checkStatus)
      .then(parseJSON)
      .then(receiveData)
      .catch(responseFailure)
  }
}

export function fetchGraphIfNeeded () {
  return (dispatch, getState) => {
    if (shouldFetchGraph(getState())) {
      return dispatch(fetchGraph())
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

function shouldFetchGraph (state) {
  return no(state.when_downloaded)
}
