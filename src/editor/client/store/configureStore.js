import { createStore, applyMiddleware, compose } from 'redux'
import autorunMiddleware from '../middlewares/autorun'
import canvasMiddleware from '../middlewares/canvas'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      autorunMiddleware,
      canvasMiddleware,
      thunkMiddleware
    ),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export default configureStore
