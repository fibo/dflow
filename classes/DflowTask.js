
function DflowTask (graph, obj) {
  this.graph = graph

  if (typeof obj.task !== 'function')
    throw new TypeError()

  this.task = obj.task
  this.inputs = obj.inputs
  this.outputs = obj.outputs
}

function createInput () {
  this.graph.createTaskInput.apply(arguments)
}
DflowTask.prototype.createInput = createInput

module.exports = DflowTask

