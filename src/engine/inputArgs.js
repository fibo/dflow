var inputPipes = require('./inputPipes')

/**
 * Retrieve input arguments of a task.
 *
 * @param {Object} outs
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Array} args
 */

function inputArgs (outs, pipe, taskKey) {
  var args = []
  var inputPipesOf = inputPipes.bind(null, pipe)

  function populateArg (inputPipe) {
    var index = inputPipe[2] || 0
    var value = outs[inputPipe[0]]

    args[index] = value
  }

  inputPipesOf(taskKey).forEach(populateArg)

  return args
}

module.exports = inputArgs
