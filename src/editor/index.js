import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import App from './containers/App'
import configureStore from './store/configureStore'

/*
import reducers from './reducers'
const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension()
)
*/

const store = configureStore()

const container = document.createElement('div')
document.body.appendChild(container)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App} />
    </Router>
  </Provider>,
  container
)
