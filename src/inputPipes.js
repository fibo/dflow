
/**
 * Compute pipes that feed a task
 *
 * @param {Array} pipes
 * @param {String} taskKey
 *
 * @returns {Array} inputPipes
 */

function inputPipes (pipes, taskKey) {
  function ifIsInputPipe (pipe) {
    return pipe.to === taskKey 
  }

  return pipes.filter(ifIsInputPipe)
}

module.exports = inputPipes

