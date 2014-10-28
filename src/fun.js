
var injectArguments = require('./injectArguments')
  , inputArgs = require('./inputArgs')
  , level = require('./level')
  , validate = require('./validate')

/**
 * Create a dflow function.
 *
 * @param {Object} funcs context
 * @param {Object} graph to be executed
 *
 * @returns {Function} f
 */

function fun (funcs, graph) {
  try { validate(graph) } catch (err) { throw err }

  var levelOf = level.bind(null, graph.pipe)

  function dflowFun () {
    var gotReturn = false
      , outs = {}
      , returnValue

    var inputArgsOf = inputArgs.bind(null, outs, graph.pipe)

    funcs = injectArguments(funcs, graph.task, arguments)

    function byLevel (a, b) {
      return levelOf(a.key) - levelOf(b.key)
    }

    function run (taskKey) {
      var args = inputArgsOf(taskKey)
        , funcName = graph.task[taskKey]
        , func = funcs[funcName]

      // Behave like a JavaScript function: if found a return, skip all other tasks.
      if (gotReturn)
        return

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      outs[taskKey] = func.apply(null, args)
    }

    Object.keys(graph.task).sort(byLevel).forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph.
  dflowFun.graph = graph

  return dflowFun
}

module.exports = fun

