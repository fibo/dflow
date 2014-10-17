
var injectArguments = require('./injectArguments')
  , inputArgs = require('./inputArgs')
  , level = require('./level')
  , validate = require('./validate')

function func (funcs, graph) {
  validate(funcs, graph)

  var inputArgsOf = inputArgs.bind(null, graph)
    , levelOf = level.bind(null, graph)

  return function dflowFunc () {
    graph.outs = {}
    graph.errs = {}

    funcs = injectArguments(funcs, graph, arguments)

    function byLevel (a, b) {
      return levelOf(a) - levelOf(b)
    }

    function run (task) {
      var func = funcs[task.func]

      var args = inputArgs(graph, task)
  
      try {
        graph.outs[task.id] = func.apply(null, args)
      }
      catch (err) {
        graph.errs[task.id] = err
      }
    }

    graph.tasks.sort(byLevel).forEach(run)

    return
  }
}

module.exports = func

