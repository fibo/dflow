
var registered = require('./registry.js')

function register (name, func) {
  registered[name] = func
}

exports.register = register

/**
 * Compute index of task
 *
 * @api private
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Number} index array
 */

function indexOfTask (graph, task) {
  for (var i in graph.tasks)
    if (task.id === graph.tasks[i].id)
      return i
}

/**
 * Get task by id
 *
 * @param {Object} graph
 * @param {Scalar} id
 *
 * @return {Objct} task
 */

function taskById (graph, id) {
  for (var i in graph.tasks)
    if (graph.tasks[i].id === id)
      return graph.tasks[i]
}

exports.taskById = taskById

/**
 * Compute input pipes of task
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Array} inputPipes connected to task
 */

function inputPipesOfTask (graph, task) {
  var inputPipes = []

  graph.pipes.forEach(function (pipe) {
    if (pipe.targetId[0] === task.id)
      inputPipes.push(pipe)
  })

  return inputPipes
}

exports.inputPipesOfTask = inputPipesOfTask

/**
 * Compute tasks that feeds the given task
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Array} parentsOfTask
 */

function parentsOfTask (graph, task) {
  var parentTasks = []

  inputPipesOfTask(graph, task)
    .forEach(function (pipe) {
      graph.tasks.forEach(function (task) {
        if (pipe.sourceId === task.id)
          parentTasks.push(task)
      })
    })

  return parentTasks
}

exports.parentsOfTask = parentsOfTask

/**
 * Compute level of task
 *
 * A task that has no input pipe has level 0.
 * The level task equals one plus the max level of parent tasks.
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Number} level
 */

function levelOfTask (graph, task) {
  var level = 0

  parentsOfTask(graph, task)
    .forEach( function (parentTask) {
      level = Math.max(level, levelOfTask(graph, parentTask) + 1)
    })

  return level
}

exports.levelOfTask = levelOfTask

/**
 * Compute arguments of task
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Array} inputArg
 */

function inputArgOfTask (graph, task) {
  var inputArg = task.arg

  inputPipesOfTask(graph, task)
    .forEach(function (pipe) {
      var argIndex = pipe.targetId[1]
        , sourceTask = taskById(graph, pipe.sourceId)

      inputArg[argIndex] = sourceTask.out
    })

  return inputArg
}

exports.inputArgOfTask = inputArgOfTask

/** Evaluate a dflow graph
 *
 * This is the core of dflow
 *
 * @param {Object} graph
 *
 * @return {Object} graph
 */

function evaluate (graph) {
  graph.tasks
       .sort(function byLevel (a, b) {
         return levelOfTask(graph, a) - levelOfTask(graph, b)
       })
       .forEach(function run (task) {
         var func = registered[task.name]
           , arg = inputArgOfTask(graph, task)

         var out = func.apply(null, task.arg)

         var i = indexOfTask(graph, task)

         graph.tasks[i].arg = arg
         graph.tasks[i].out = out
       })

  return graph
}

exports.evaluate = evaluate

/**
 * Checks task name is available in registry
 *
 * @return {Boolean} isValid
 */

function isTask () {

}

/**
 * Checks tasks and pipes are valid
 *
 * @param {Object} graph
 *
 * @return {Boolean} isValid
 */

function isGraph () {

}

/**
 * Adds a task
 *
 * #param {Object} graph
 * #param {String} name of task in the registry
 *
 * @param {Number} taskId
 */

function addTask (graph, name, arg) {

}

/**
 * Pipes two tasks
 *
 * #param {Object} graph
 * #param {Object} source task
 * #param {Object} target task
 * #param {Object} argIndex
 *
 * @param {Number} pipeId
 */

function addPipe (graph, source, target, argIndex) {

}

/**
 * Removes a task
 *
 * @param {Number} taskId
 */

function delTask (taskId) {}

/**
 * Removes a pipe
 *
 * @param {Number} pipeId
 */

function delPipe (pipeId) {}

function emptyGraph () {
  return {
    tasks: [],
    pipes: []
  }
}

exports.emptyGraph = emptyGraph

