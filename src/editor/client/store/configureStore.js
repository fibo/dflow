import { createStore, applyMiddleware, compose } from 'redux'
import autorunMiddleware from '../middlewares/autorun'
import canvasMiddleware from '../middlewares/canvas'
import subgraphMiddleware from '../middlewares/subgraph'
import thunkMiddleware from 'redux-thunk'
import validateMiddleware from '../middlewares/validate'
import rootReducer from '../reducers'

function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      canvasMiddleware,
// *subgraph* must be executed before *autorun*
      subgraphMiddleware,
      validateMiddleware,
      autorunMiddleware,
      thunkMiddleware
    ),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export default configureStore
