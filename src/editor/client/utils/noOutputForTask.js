/**
 * Every task in dflow is a function hence it has an output,
 * i.e. the return value of the function.
 * Few tasks has no output, i.e. console.log, return, etc.
 *
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function noOutputForTask (taskName) {
  const noOutputTasks = ['return', 'console.log', 'console.error']

  return noOutputTasks.indexOf(taskName) > -1
}
