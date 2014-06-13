
var Registry = require('./Registry')

/**
 * Store function in dflow registry
 *
 * Delegates to dflow.Registry.add
 *
 * @param {String} name identifier of task
 * @param {Function} func to store in registry
 * @param {Object} context
 *
 * @return {Function} func stored in registry
 */

function register (name, func, context) {
  return Registry.set(name, func, context)
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

exports.indexOfTask = indexOfTask

/**
 * Get task by id
 *
 * @param {Object} graph
 * @param {Number} id
 *
 * @return {Object} task
 */

function getTaskById (graph, id) {
  for (var i in graph.tasks)
    if (graph.tasks[i].id === id)
      return graph.tasks[i]
}

exports.getTaskById = getTaskById

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

      sourceTask = getTaskById(graph, sourceId)
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
  register('thisGraph', function thisGraph () { return graph })

  graph.tasks
       .sort(function byLevel (a, b) {
         return levelOfTask(graph, a) - levelOfTask(graph, b)
       })
       .forEach(function run (task) {
         var arg, func, i, out

         func = Registry.get(task.name)

         arg = inputArgOfTask(graph, task)
         out = func.apply(null, task.arg)
         i = indexOfTask(graph, task)

         graph.tasks[i].arg = arg
         graph.tasks[i].out = out
       })

  return graph
}

exports.evaluate = evaluate

