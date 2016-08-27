import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'

const store = configureStore()

// TODO prova a rinominare flow-view/containers/App in flow-view/containers/Canvas o FlowView
// fai che il container di flow view usa sempre lo store sotto "view"
// e poi dovresti poter fare tipo
// import FlowView from 'flow-view/containers/FlowView'

// render(
//  <Provider store={store}>
//    <App />
//    <FlowView />
// </Provider>,
//  document.getElementById('root')
// )

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
