import validate from '../../../engine/validate'

export default function autorunMiddleware (store) {
  return (next) => (action) => {
    const result = next(action)

    const { graph } = store.getState()

    try {
      validate(graph)
    } catch (err) {
      console.error(err)
    }

    return result
  }
}
