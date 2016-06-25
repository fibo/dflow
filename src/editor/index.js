import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'

const store = configureStore()

const containerId = 'dflow'

let container = document.getElementById(containerId)

if (!container) {
  container = document.createElement('div')
  container.id = containerId
  document.body.appendChild(container)
}

render(
  <Provider store={store}>
    <App view={{ container }} />
  </Provider>,
  container
)
