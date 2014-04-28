
var DflowTask = require('./DflowTask')
  , inherits  = require('inherits')

function DflowGraph () {
  DflowTask.apply(this, arguments)

  this.edges = []
  this.tasks = []
}

inherits(DflowGraph, DflowTask)

/*
 * @param {Object} task
 */

function createTask (obj) {
  this.tasks.push(new DflowTask(obj))
}

DflowGraph.prototype.createTask = createTask

/*
 * Runs every task
 */

function run () {
}

DflowGraph.prototype.run = run

module.exports = DflowGraph

