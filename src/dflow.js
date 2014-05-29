
var registered = require('./registry.js')

function register (name, func) {
  registered[name] = func
}

exports.register = register

function indexOfTask (graph, task) {
  for (var i in graph.tasks)
    if (task.id === graph.tasks[i].id)
      return i
}

function taskById (graph, id) {
  for (var i in graph.tasks)
    if (graph.tasks[i].id === id)
      return graph.tasks[i]
}

function inputPipesOfTask (graph, task) {
  var inputPipes = []

  graph.pipes.forEach(function (pipe) {
    if (pipe.targetId[0] === task.id)
      inputPipes.push(pipe)
  })

  //console.log('task', task, 'has inputPipes', inputPipes)

  return inputPipes
}

function parentsOfTask (graph, task) {
  var parentTasks = []

  inputPipesOfTask(graph, task)
    .forEach(function (pipe) {
      graph.tasks.forEach(function (task) {
        if (pipe.sourceId === task.id)
          parentTasks.push(task)
      })
    })

  //console.log('task', task, 'has parentTasks', parentTasks)

  return parentTasks
}

function levelOfTask (graph, task) {
  var level = 0

  parentsOfTask(graph, task)
    .forEach( function (parentTask) {
      level = Math.max(level, levelOfTask(graph, parentTask) + 1)
    })

  return level
}

exports.levelOfTask = levelOfTask

function inputArgOfTask (graph, task) {
  var inputArg = task.arg

  inputPipesOfTask(graph, task)
    .forEach(function (pipe) {
      var argIndex = pipe.targetId[1]
        , sourceTask = taskById(graph, pipe.sourceId)

      inputArg[argIndex] = sourceTask.out
    })

  //console.log('task', task, 'has inputArg', inputArg)

  return inputArg
}

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
         //console.log('running task', task)
       })

  return graph
}

exports.evaluate = evaluate

function emptyGraph () {
  return {
    tasks: [],
    pipes: []
  }
}

exports.emptyGraph = emptyGraph

