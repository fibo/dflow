import fetch from 'isomorphic-fetch'

import checkStatus from './checkStatus'
import parseJSON from './parseJSON'

export default function put (endpoint, data) {
  const method = 'PUT'
  const body = JSON.stringify(data)
  const headers = {
    'Content-Type': 'application/json'
  }

  return fetch(endpoint, { body, headers, method })
           .then(checkStatus)
           .then(parseJSON)
}
