
var DflowTask = require('./DflowTask')
  , inherits  = require('inherits')

/**
 * A graph made of of tasks
 */

function DflowGraph () {
  DflowTask.apply(this, arguments)

  /**
   * Edge list
   */

  this.edges = []

  /**
   * Task list
   */

  this.tasks = []
}

/*!
 * Inheritance
 */

inherits(DflowGraph, DflowTask)

/**
 * Push a DflowTask
 *
 * @param {Object} task
 */

function createTask (obj) {
  this.tasks.push(new DflowTask(obj))
}

DflowGraph.prototype.createTask = createTask

/**
 * Run every task
 */

function run () {
}

DflowGraph.prototype.run = run

module.exports = DflowGraph

