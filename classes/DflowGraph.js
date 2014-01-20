
var iper = require('iper')

var IperGraph = iper.IperGraph

var DflowHost = require('./DflowHost')
var DflowTask = require('./DflowTask')

function DflowGraph (host) {

  if (! (host instanceof DflowHost))
    throw new TypeError('Not a DflowHost instance')

  Object.defineProperty(this, 'host', {value: host})

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

