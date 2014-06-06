
// Load core registry at compile time
var registered = require('./registry.js')

var nextId = 0

/**
 * Wrap into a Function
 *
 * @api private
 *
 * @param {Any} arg
 *
 * @return {Function} func
 */

function coerceToFunction (arg) {
  if (typeof arg === 'function')
    return arg
  else
    return function value () { return arg }
}

/**
 * Store function in dflow registry
 *
 * @param {String} name identifier of task
 * @param {Function} func to store in registry
 *
 * @return {Function} func stored in registry
 */

function register (name, func) {
  if (registered[name])
    return registered[name]

  // At this point func was not found in registry
  // so dflow will try to get it from global
  var path = name.split('.')

  var globalName = path[0]
    , propName = path[1]

  if (typeof global[globalName] !== 'undefined') {
    if (typeof propName !== 'undefined') {
      registered[name] = coerceToFunction(global[globalName][propName])

      return registered[name]
    }
  }

  // At this point no func was found in global
  // so if a func was passed as parameter, I assume it should be inserted
  // into the registry.
  // Custom functions in registry will not override global definitions.

  registered[name] = coerceToFunction(func)
  return registered[name]
}

register('dflow.register', register)

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
 * @param {Number} id
 *
 * @return {Object} task
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
    if (pipe.to[0] === task.id)
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
        if (pipe.from === task.id)
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
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Array} inputArg
 */

function inputArgOfTask (graph, task) {
  var inputArg = task.arg || []

  inputPipesOfTask(graph, task)
    .forEach(function (pipe) {
      var arg
        , argIndex
        , out
        , sourceId
        , sourceProp
        , sourceTask
        , targetId

      // pipe.from can be a taskId or an array [taskId, prop]
      if (Array.isArray(pipe.from)) {
        sourceId = pipe.from[0]
        sourceProp = pipe.from[1]
      }
      else {
        sourceId = pipe.from
        sourceProp = 'out'
      }

      sourceTask = taskById(graph, sourceId)
      arg = sourceTask[sourceProp]

      // pipe.to is an array [taskId, argIndex]
      argIndex = pipe.to[1]
      inputArg[argIndex] = arg
    })

  return inputArg
}

exports.inputArgOfTask = inputArgOfTask

/**
 * Evaluate a dflow graph
 *
 * This is the core of dflow
 *
 * @param {Object} graph
 *
 * @return {Object} graph
 */

function evaluate (graph) {
  registered['thisGraph'] = function thisGraph () { return graph }

  graph.tasks
       .sort(function byLevel (a, b) {
         return levelOfTask(graph, a) - levelOfTask(graph, b)
       })
       .forEach(function run (task) {
         var arg, func, i, out

         func = register(task.name)

         arg = inputArgOfTask(graph, task)
         out = func.apply(null, task.arg)
         i = indexOfTask(graph, task)

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
 * Add a task
 *
 * @param {Object} graph
 * @param {String} name of task in the registry
 * @param {Array} arg list passed to task function
 *
 * @return {Object} task
 */

function addTask (graph, name, arg) {
  if (typeof arg === 'undefined')
    arg = []

  var task = {
    id: nextId++
  , name: name
  , arg: arg
  }

  graph.tasks.push(task)

  return task
}

exports.addTask = addTask

/**
 * Pipe two tasks
 *
 * @param {Object} graph
 * @param {Object} from source task
 * @param {Object} to target task
 * @param {Object} argIndex
 *
 * @return {Object} pipe
 */

function addPipe (graph, from, to, argIndex) {
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

  return pipe
}

exports.addPipe = addPipe

/**
 * Remove a task
 *
 * @param {Object} graph
 * @param {Object} task
 *
 * @return {Object} task
 */

function delTask (graph, task) {

  return task
}

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

/**
 * Return an empty graph
 *
 * @return {Object} graph
 */

function emptyGraph () {
  return {
    tasks: []
  , pipes: []
  }
}

exports.emptyGraph = emptyGraph

