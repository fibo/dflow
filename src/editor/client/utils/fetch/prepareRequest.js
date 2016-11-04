import receiveData from './receiveData'
import responseFailure from './responseFailure'

export default function prepareRequest (dispatch, actionName) {
  dispatch({ type: `${actionName}_REQUEST` })

  return {
    receiveData: receiveData(dispatch, actionName),
    responseFailure: responseFailure(dispatch, actionName)
  }
}
