import fun from '../../../engine/fun'
import validate from '../../../engine/validate'
import additionalFunctions from '../utils/additionalFunctions'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const state = store.getState()

    // TODO nothing to do client side if context is *server*
    // if (state.info && state.info.context === 'server') return result

    // Check that graph is valid and execute it.
    try {
      validate(state)

      // TODO additionalFunctions... how to pass them?
      // TODO how to pass arguments?
      fun(state, additionalFunctions)()
    } catch (err) {
      console.error(err)
      // TODO dflowFunction should collect all errors and finally throw them
      // so here it could be possible to catch them and highlight red nodes by their ids.
    }

    return result
  }
}
