
function inputPipes (pipes, task) {
  function ifIsInputPipe (pipe) {
    return pipe.to.key === task.key 
  }

  return pipes.filter(ifIsInputPipe)
}

module.exports = inputPipes

