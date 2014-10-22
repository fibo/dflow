
var inputPipes = require('./inputPipes')

/**
 * Retrieve input arguments of a task
 *
 * @param {Object} outs
 * @param {Array} pipes
 * @param {String} taskKey
 *
 * @returns {Array} args
 */

function inputArgs (outs, pipes, taskKey) {
  var args = []
    , inputPipesOf = inputPipes.bind(null, pipes)
  
  function populateArg (pipe) {
    var index = pipe.arg
      , value = outs[pipe.from]

    args[index] = value
  }

  inputPipesOf(taskKey).forEach(populateArg)

  return args
}

module.exports = inputArgs

