
var registered = {}

function register (name, func) {
  registered[name] = func
}

exports.register = register

function evaluate (graph) {
      // there are at most tasks.length levels
  var maxLevel = graph.tasks.length
    , levelOf = {}

  function nextLevel () {

    graph.tasks.forEach(function (task) {
      var foundPipe      = false
        , maxParentLevel = -1

      if (typeof levelOf[task.id] !== 'undefined')
        return

      graph.pipes.forEach(function computeMaxParentLevel (pipe) {
        if (pipe.targetId[0] === task.id) {
          foundPipe = true

          if (typeof levelOf[pipe.sourceId] === 'number') {
            maxParentLevel = Math.max(levelOf[pipe.sourceId], maxParentLevel)
          }
        }
      })

      if (foundPipe)
        levelOf[task.id] = maxParentLevel + 1
      else
        levelOf[task.id] = 0
    })
  }

  for (var i = 0; i < maxLevel; i++)
    nextLevel()

  console.log(levelOf)

  function run (task) {
    var func = registered[task.name]

    graph.pipes.forEach(function (pipe) {
      if (pipe.targetId[0] === task.id) {
        var argIndex = pipe.targetId[1]
          , parentTaskId = pipe.sourceId
          , parentTask

        graph.tasks.forEach(function (task) {
          if (parentTask)
            return

          if (parentTaskId === task.id)
            parentTask = task
        })

        if (parentTask)
          task.arg[argIndex] = parentTask.out
      }
    })

    task.out = func.apply(null, task.arg)
  }

  function byLevel (a, b) {
    return levelOf[a.id] - levelOf[b.id]
  }

  graph.tasks.sort(byLevel)
       .forEach(run)

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

