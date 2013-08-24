
var _    = require('underscore')
  , iper = require('iper')
  , util = require('util')

var DflowInput  = require('./DflowInput')
  , DflowOutput = require('./DflowOutput')

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
  _.each(inputs, function(data) {
    var input = new DflowInput(self, data)

    Object.defineProperty(self, input.name, {value: input})
  })

  // outputs
  _.each(outputs, function(data) {
    var output = new DflowOutput(self, data)

    Object.defineProperty(self, output.name, {value: output})
  })
}

util.inherits(DflowTask, IperNode)

// runTask
function runTask() {
  this.task.call(this)
}
DflowTask.prototype.runTask = runTask

module.exports = DflowTask

