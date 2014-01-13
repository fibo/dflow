
var _    = require('underscore')
  , iper = require('iper')
  , inherits = require('inherits')

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

  // inputs
  _.each(inputs, function(data) {
    var input = new DflowInput(self, data)

    Object.defineProperty(self, input.name, {value: input})
  })

  // outputs
  _.each(outputs, function(prop) {
    self.createOutput(prop)
  })

  // task
  // must be created after inputs and outputs
  Object.defineProperty(this, 'task', {value: task})

}

inherits(DflowTask, IperNode)

function createOutput(prop) {
  var output = new DflowOutput(this, prop)

  Object.defineProperty(this, output.name, {value: output})
}
DflowTask.prototype.createOutput = createOutput

// runTask
function runTask() {
  this.task()
}
DflowTask.prototype.runTask = runTask

module.exports = DflowTask

