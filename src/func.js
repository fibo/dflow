
var injectArguments = require('./injectArguments')
  , inputArgs = require('./inputArgs')
  , level = require('./level')

function func (funcs, graph) {
  var inputArgsOf = inputArgs.bind(null, graph)
    , levelOf = level.bind(null, graph)

  function dflowFunc () {
    var gotReturn = false
      , returnValue

    graph.outs = {}

    funcs = injectArguments(funcs, graph, arguments)

    function byLevel (a, b) {
      return levelOf(a) - levelOf(b)
    }

    function run (task) {
      var args = inputArgsOf(task)
        , funcName = task.func
        , func = funcs[funcName]

      if (gotReturn)
        return

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      graph.outs[task.key] = func.apply(null, args)
    }

    graph.tasks.sort(byLevel).forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph
  dflowFunc.graph = graph

  return dflowFunc
}

module.exports = func

