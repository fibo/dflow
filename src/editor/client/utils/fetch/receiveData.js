export default function receiveData (dispatch, actionName) {
  return function (data) {
    dispatch({
      type: `${actionName}_SUCCESS`,
      data
    })
  }
}
