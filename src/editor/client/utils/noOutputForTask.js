import regexComment from '../../../engine/regex/comment'

/**
 * Every task in dflow is a function hence it has an output,
 * i.e. the return value of the function.
 * Few tasks has no output, i.e. console.log, return, etc.
 *
 * @param {String} taskName
 * @returns {Boolean}
 */

export default function noOutputForTask (taskName) {
  if (regexComment.test(taskName)) return true

  if (taskName.split('.')[0] === 'console') return true

  const noOutputTasks = ['return']

  return noOutputTasks.indexOf(taskName) > -1
}
