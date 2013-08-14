
var _    = require('underscore')
  , iper = require('iper')
  , util = require('util')

var IperNode = iper.IperNode

function DflowTask(graph, arg) {

  if (arguments.length !== 2)
    throw Error()

  IperNode.call(this, graph)

  var task

  if (_.isFunction(arg))
    task = arg

  this.inputs = {}
  this.outputs = {}

  // task
  function getTask() { return task }

  Object.defineProperty(this, 'task', {get: getTask})
}

util.inherits(DflowTask, IperNode)

function runTask() {
  this.task.call(this)
}
DflowTask.prototype.runTask = runTask

module.exports = DflowTask

