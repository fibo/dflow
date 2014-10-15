
function outputPipesOf (pipes, task) {
  function ifIsOutputPipe (pipe) {
    return pipe.from.id === task.id 
  }

  return pipes.filter(ifIsOutputPipe)
}

module.exports = outputPipesOf

