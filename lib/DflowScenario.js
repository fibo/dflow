
var util = require('util')
  , _    = require('underscore')

var DflowGraph = require('./DflowGraph')
  , DflowSlot = require('./DflowSlot')
  , DflowTask = require('./DflowTask')

// define a global graph
var root = new DflowGraph()

function DflowScenario(graph) {
  // use root graph, unless provided another graph
  if (_.isUndefined(graph))
    graph = root

  if (! (graph instanceof DflowGraph))
    throw new Error()

  var task = function () {/* TODO run every task */}

  DflowTask.call(this, graph, task)
}

util.inherits(DflowScenario, DflowTask)

// #createSlot()
function createSlot(data) {
  var slot = new DflowSlot(this.graph, data)

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
function createEdge(sourceAndTargetIds) {
  this.graph.createEdge(sourceAndTargetIds)
}
DflowScenario.prototype.createEdge = createEdge

module.exports = DflowScenario

