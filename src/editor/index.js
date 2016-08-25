import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import { Canvas } from 'flow-view'

const store = configureStore()

const containerId = 'dflow'
const container = document.createElement('div')
container.id = containerId
document.body.appendChild(container)

const canvasContainerId = 'dflow-canvas'
const canvasContainer = document.createElement('div')
canvasContainer.id = canvasContainerId
document.body.appendChild(canvasContainer)

const canvas = new Canvas(canvasContainerId)
canvas.render()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container
)
