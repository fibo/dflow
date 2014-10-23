
var injectArguments = require('./injectArguments')
  , inputArgs = require('./inputArgs')
  , level = require('./level')
  , listOf = require('./listOf')
  , validate = require('./validate')

/**
 * Create a dflow function.
 *
 * @param {Object} funcs context
 * @param {Object} graph to be executed
 *
 * @returns {Function} f
 */

function func (funcs, graph) {
// TODO  try { validate(graph) } catch (err) { throw err }

  var pipes = listOf(graph.pipe)
    , tasks = listOf(graph.task)

  var levelOf = level.bind(null, pipes, tasks)

  function dflowFunc () {
    var gotReturn = false
      , outs = {}
      , returnValue

    var inputArgsOf = inputArgs.bind(null, outs, pipes)

    funcs = injectArguments(funcs, tasks, arguments)

    function byLevel (a, b) {
      return levelOf(a.key) - levelOf(b.key)
    }

    function run (task) {
      var args = inputArgsOf(task.key)
        , funcName = task.func
        , func = funcs[funcName]

      if (gotReturn)
        return

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      outs[task.key] = func.apply(null, args)
    }

    tasks.sort(byLevel).forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph
  dflowFunc.graph = graph

  return dflowFunc
}

module.exports = func

