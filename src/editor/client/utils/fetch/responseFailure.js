export default function responseFailure (dispatch, actionName) {
  return function (error) {
    dispatch({
      type: `${actionName}_FAILURE`,
      error
    })
  }
}
