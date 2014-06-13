
var algorithm = require('./algorithm')

var nextId = 0


/**
 * DflowGraph constructor
 *
 * ```
 * var dflow = require('dflow')
 *
 * var graph = new dflow.Graph()
 * ```
 */

function DflowGraph () {
  this.tasks = []
  this.pipes = []
}

/**
 * Add a task
 *
 * @param {String} name of task in the registry
 * @param {Array} arg list passed to task function
 *
 * @return {Object} task
 */

function addTask (name, arg) {
  if (typeof arg === 'undefined')
    arg = []

  var task = {
    id: nextId++
  , name: name
  , arg: arg
  }

  this.tasks.push(task)

  return task
}

DflowGraph.prototype.addTask = addTask

/**
 * Pipe two tasks
 *
 * @param {Object} from source task
 * @param {Object} to target task
 * @param {Object} argIndex
 *
 * @return {Object} pipe
 */

function addPipe (from, to, argIndex) {
  var sourceId, targetId

  sourceId = from.id
  targetId = to.id

  if (typeof argIndex === 'undefined')
    argIndex = to.arg.length + 1

  var pipe = {
    id: nextId++
  , from: sourceId
  , to: [targetId, argIndex]
  }

  this.pipes.push(pipe)

  return pipe
}

DflowGraph.prototype.addPipe = addPipe

/**
 * Remove a task
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Object} task
 */

function delTask (task) {
  this.tasks.splice(algorithm.indexOfTask(task), 1)

  return task
}

DflowGraph.prototype.delTask = delTask

/**
 * Remove a pipe
 *
 * @param {Object} graph
 * @param {Object} pipe
 *
 * @return {Object} pipe
 */

function delPipe (graph, pipe) {

  return pipe
}

DflowGraph.prototype.delPipe = delPipe

/**
 * Get task by given id
 *
 * @param {Number} id
 *
 * @return {Object} task
 */

function getTaskById (id) {
  return algorithm.getTaskById(this, id)
}

DflowGraph.prototype.getTaskById = getTaskById

/**
 * Execute tasks
 *
 * Delegate to `dflow.evaluate()`
 *
 */

function evaluate () {
  var graph = algorithm.evaluate(this)

  this.tasks = graph.tasks
  this.pipes = graph.pipes
}

DflowGraph.prototype.evaluate = evaluate

module.exports = DflowGraph

