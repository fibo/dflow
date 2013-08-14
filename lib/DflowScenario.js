
var util  = require('util')

var DflowTask = require('./DflowTask')

function DflowScenario(graph) {

  var task = function () {/* TODO run every task */}

  DflowTask.call(this, graph, task)
}

util.inherits(DflowScenario, DflowTask)

function createArguments() {
  // TODO crea Slot con check = _.isArguments
}
DflowScenario.prototype.createArguments = createArguments

function createFunction() {
  // TODO crea task con un input = arguments
  //      1 output = return
}
DflowScenario.prototype.createFunction = createFunction

function createNode() {
  this.graph.createNode()
}
DflowScenario.prototype.createNode = createNode

function createEdge() {
  this.graph.createEdge()
}
DflowScenario.prototype.createEdge = createEdge

module.exports = DflowScenario

