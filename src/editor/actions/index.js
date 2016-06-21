export const ADD_TASK = 'ADD_TASK'

export function addTask (id) {
  return {
    type: ADD_TASK,
    id
  }
}

export const ADD_PIPE = 'ADD_PIPE'

export function addPipe (id) {
  return {
    type: ADD_PIPE,
    id
  }
}

function fetchGraph () {

}

function shouldFetchGraph () {
  console.log('TODO fetch graph')
  return false
}

export function fetchGraphIfNeeded () {
   return (dispatch, getState) => {
    if (shouldFetchGraph(getState())) {
      return dispatch(fetchGraph())
    }
  }
}
