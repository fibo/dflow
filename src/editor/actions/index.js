export const ADD_TASK = 'ADD_TASK'

export function addTask (id) {
  return {
    type: ADD_TASK,
    id
  }
}
