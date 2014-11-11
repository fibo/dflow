
var injectArguments = require('./injectArguments')
  , injectAccessors = require('./injectAccessors')
  , inputArgs = require('./inputArgs')
  , level = require('./level')
  , validate = require('./validate')

/**
 * Create a dflow function.
 *
 * @param {Object} context
 * @param {Object} graph to be executed
 *
 * @returns {Function} f
 */

function fun (context, graph) {
  try { validate(graph) } catch (err) { throw err }

  // Clone context.
  var funcs = {}

  function cloneFunctions (key) {
    if (typeof context[key] === 'function')
      funcs[key] = context[key]
  }

  Object.keys(context).forEach(cloneFunctions)

  var cachedLevelOf = {}
    , computeLevelOf = level.bind(null, graph.pipe, cachedLevelOf)

  function dflowFun () {
    var gotReturn = false
      , outs = {}
      , returnValue

    var inputArgsOf = inputArgs.bind(null, outs, graph.pipe)

    injectArguments(funcs, graph.task, arguments)
    injectAccessors(funcs, graph)

    function byLevel (a, b) {
      if (typeof cachedLevelOf[a] === 'undefined')
        cachedLevelOf[a] = computeLevelOf(a)

      if (typeof cachedLevelOf[b] === 'undefined')
        cachedLevelOf[b] = computeLevelOf(b)

      return cachedLevelOf[a] - cachedLevelOf[b]
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

