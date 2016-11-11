import fetch from 'isomorphic-fetch'

import checkStatus from './checkStatus'
import parseJSON from './parseJSON'

export default function get (endpoint) {
  return fetch(endpoint)
           .then(checkStatus)
           .then(parseJSON)
}
