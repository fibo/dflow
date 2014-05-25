
var registered = {}

function register (name, func) {
  registered[name] = func
}

exports.register = register

function evaluate (graph) {
  var currentLevel = -1
    , level = []
    , pipes = graph.pipes
    , seen = {}
    , tasks = graph.tasks

  for (var i in tasks)
    seen[i] = false

  function nextLevel () {
    var thisLevel = []

    currentLevel++
    console.log('currentLevel ' + currentLevel)

    for (var i in tasks) {
      var task = tasks[i]
        , belongsToThisLevel = true

      if (!seen[task.id]) {
        for (var j in pipes) {
          var pipe = pipes[j]

          if (pipe.targetId[0] === task.id) {
            console.log('pipe.id', pipe.id, 'has targetId', task.id, 'and sourceId', pipe.sourceId)

            if (!seen[pipe.sourceId]) {
              belongsToThisLevel = false
            }
          }
        }

        if (belongsToThisLevel) {
          console.log('task.id', task.id, 'has level', currentLevel)
          thisLevel.push(task)
          seen[task.id] = true
        }
      }
    }

    if (thisLevel.length > 0)
      level[currentLevel] = thisLevel
  }

  // there are at most tasks.length levels
  for (var i in tasks)
    nextLevel(i)

  console.dir(level)

  function run(i) {
    var task

    for (var t in tasks)
      if (tasks[t].id === i)
        task = tasks[t]

    var func = registered[task.name]

    for (var j in pipes) {
      var pipe = pipes[j]

      if (pipe.targetId[0] === task.id) {
        var argIndex = pipe.targetId[1]
          , parentTaskId = pipe.sourceId

        var parentTask = tasks[parentTaskId]

        task.arg[argIndex] = parentTask.out
      }
    }

    task.out = func.apply(null, task.arg)
  }

  level.forEach(function (elements) {
    elements.forEach(function (element) {
      run(element.id)
    })
  })
}

exports.evaluate = evaluate

