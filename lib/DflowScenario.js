
var util  = require('util')

var DflowSlot = require('./DflowSlot')
  , DflowTask = require('./DflowTask')

function DflowScenario(graph) {

  var task = function () {/* TODO run every task */}

  DflowTask.call(this, graph, task)
}

util.inherits(DflowScenario, DflowTask)

function createArguments() {
  var slot = new DflowSlot(this, arguments)
  return slot.id
  // TODO crea Slot con check = _.isArguments
}
DflowScenario.prototype.createArguments = createArguments

function createFunction(task) {
  var func = new DflowTask(this, task)
  return func.id
}
DflowScenario.prototype.createFunction = createFunction

function createEdge() {
  this.graph.createEdge.apply(arguments)
}
DflowScenario.prototype.createEdge = createEdge

module.exports = DflowScenario

