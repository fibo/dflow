
function DflowTask (graph, obj) {
  this.graph = graph

  if (typeof obj.task !== 'function')
    throw new TypeError()

  this.info = obj.info
  this.task = obj.task
  this.inputs = obj.inputs
  this.outputs = obj.outputs
}

function createInput () {
  //this.graph.createTaskInput.apply(arguments)
}
DflowTask.prototype.createInput = createInput

function createOutput () { }
DflowTask.prototype.createOutput = createOutput

function readInput () { }
DflowTask.prototype.readInput = readInput

function readOutput () { }
DflowTask.prototype.readOutput = readOutput

function init () {
  throw new Error('Unimplemented init method')
}
DflowTask.prototype.init = init

function task () {
  throw new Error('Unimplemented task method')
}
DflowTask.prototype.task = task

module.exports = DflowTask

