import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import reducers from './reducers'

var graph = {}

const store = createStore(
  reducers,
  graph,
  window.devToolsExtension && window.devToolsExtension()
)

const container = document.createElement('div')
document.body.appendChild(container)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container
)
