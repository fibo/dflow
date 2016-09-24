import { createStore, applyMiddleware, compose } from 'redux'
import canvasMiddleware from '../middlewares/canvas'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      canvasMiddleware,
      thunkMiddleware
    ),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export default configureStore
