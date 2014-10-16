
var injectArguments = require('./injectArguments')
var leavesOf = require('./leavesOf')
var run = require('./run')

function func (funcs, graph) {
  graph.outs = {}

  function dflowFunc () {
    funcs = injectArguments(funcs, graph, arguments)
//    var runTask = run.bind(null, funcsWithArguments, graph)

    var runTask = run.bind(null, funcs, graph)

    var returns = {}

    graph.tasks.forEach(runTask)

    leavesOf(graph).forEach(function (task) {
      returns[task.id] = graph.outs[task.id]
    })

    return returns
  }

  return dflowFunc
}

module.exports = func

