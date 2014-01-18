
var iper = require('iper')

var IperGraph = iper.IperGraph

var DflowTask = require('./DflowTask')

function DflowGraph () {

  this.graph = new IperGraph()

  // the main task
  this.task = new DflowTask(this, {
    task: runTasks,
    inputs: [],
    outputs: []
  })

}

function runTasks () {}

function createTaskInput (task, inputArgs) {
  var node = this.graph.createNode()

  var input = new DflowInput(node, inputArgs)
}
DflowGraph.prototype.createTaskInput = createTaskInput

module.exports = DflowGraph

