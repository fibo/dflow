/**
 * @param {String} taskName
 * @returns {Boolean}
 */
export default function singleInputTask (taskName) {
  const singleInputTasks = ['return', 't']

  return singleInputTasks.indexOf(taskName) > -1
}
