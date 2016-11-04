import validate from '../../../engine/validate'
import {
  disableAutorun
} from '../actions'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { graph } = store.getState()

    try {
      validate(graph)
    } catch (err) {
      store.dispatch(disableAutorun())
      // TODO remove console and add to some footbar.
      // dispach an invalidGraph method with err as parameter.
      console.error(err)
    }

    return result
  }
}
