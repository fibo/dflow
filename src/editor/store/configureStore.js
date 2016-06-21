import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(
      thunkMiddleware
    ),
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
  )
}

export default configureStore
