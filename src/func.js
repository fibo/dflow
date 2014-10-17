
var injectArguments = require('./injectArguments')
  , inputArgs = require('./inputArgs')
  , level = require('./level')

function func (funcs, graph) {
  var inputArgsOf = inputArgs.bind(null, graph)
    , levelOf = level.bind(null, graph)

  return function dflowFunc () {
    var gotReturn = false
      , returnValue

    graph.outs = {}

    funcs = injectArguments(funcs, graph, arguments)

    function byLevel (a, b) {
      return levelOf(a) - levelOf(b)
    }

    function run (task) {
      var args = inputArgs(graph, task)
        , funcName = task.func
        , func = funcs[funcName]

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      graph.outs[task.id] = func.apply(null, args)
    }

    graph.tasks.sort(byLevel).forEach(run)

    return returnValue
  }
}

module.exports = func

