import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'

const store = configureStore()

const container = document.getElementById('react-app')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container
)
