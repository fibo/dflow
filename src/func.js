
var injectArguments = require('./injectArguments')
  , inputArgsOf = require('./inputArgsOf')
  , leavesOf = require('./leavesOf')
  , validate = require('./validate')

function func (funcs, graph) {
  validate(funcs, graph)

  return function dflowFunc () {
    graph.outs = {}
    graph.errs = {}

    funcs = injectArguments(funcs, graph, arguments)

    function run (task) {
      var func = funcs[task.func]

      var args = inputArgsOf(graph, task)
  
      try {
        graph.outs[task.id] = func.apply(null, task.args)
      }
      catch (err) {
        graph.errs[task.id] = err
      }
    }

    var returns = {}

    graph.tasks.forEach(run)

    leavesOf(graph).forEach(function (task) {
      returns[task.id] = graph.outs[task.id]
    })

    return returns
  }
}

module.exports = func

