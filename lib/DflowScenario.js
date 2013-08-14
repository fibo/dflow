
var util  = require('util')

var DflowSlot = require('./DflowSlot')
  , DflowTask = require('./DflowTask')

function DflowScenario(graph) {

  var task = function () {/* TODO run every task */}

  DflowTask.call(this, graph, task)
}

util.inherits(DflowScenario, DflowTask)

// #createSlot()
function createSlot() {
  var args = []
  for (var i in arguments)
    args.push(arguments[i])

  var slot = new DflowSlot(this.graph, args)

  // TODO this.graph.createEdge([this.id, slot.id])
  return slot.id
}
DflowScenario.prototype.createSlot = createSlot

// #createTask()
function createTask(func) {
  var task = new DflowTask(this.graph, func)
  return task.id
}
DflowScenario.prototype.createTask = createTask

// #createEdge()
function createEdge(nodeIds) {
  this.graph.createEdge(nodeIds)
}
DflowScenario.prototype.createEdge = createEdge

module.exports = DflowScenario

