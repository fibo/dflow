
var _    = require('underscore')
  , iper = require('iper')
  , util = require('util')

var IperNode = iper.IperNode

function DflowTask(graph, arg) {
  var self = this

  var task
    , inputs
    , outputs

  if (arguments.length !== 2)
    throw Error()

  if (_.isFunction(arg))
    task = arg
  else if (_.isFunction(arg.task)) {
    task = arg.task
    inputs = arg.inputs || []
    outputs = arg.outputs || []
  }
  else
    throw new Error()

  IperNode.call(this, graph)

  if (! (_.isFunction(task)))
    throw new Error()

  // task
  function getTask() { return task }

  Object.defineProperty(this, 'task', {get: getTask})

  // inputs
  // TODO create inputs and outputs
  _.each(inputs, function(input) {
    self.createInput(input)
  })

  // outputs
  _.each(outputs, function(output) {
    self.createOutput(output)
  })
}

util.inherits(DflowTask, IperNode)


// createInput
function createInput(input) {
  console.log(input)
}
DflowTask.prototype.createInput = createInput

// createOutput
function createOutput(output) {
}
DflowTask.prototype.createOutput = createOutput

// runTask
function runTask() {
  this.task.call(this)
}
DflowTask.prototype.runTask = runTask

module.exports = DflowTask

