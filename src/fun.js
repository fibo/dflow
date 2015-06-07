
var builtinFunctions = require('./builtinFunctions'),
    injectArguments  = require('./injectArguments'),
    injectAccessors  = require('./injectAccessors'),
    injectReferences = require('./injectReferences'),
    inputArgs        = require('./inputArgs'),
    level            = require('./level'),
    validate         = require('./validate')

/**
 * Create a dflow function.
 *
 * @param {Object} graph to be executed
 * @param {Object} [additionalFunctions] is a collection of functions
 *
 * @returns {Function} dflowFun that executes the given graph.
 */

function fun (graph, additionalFunctions) {
  // First of all, check if graph is valid.
  try { validate(graph, additionalFunctions) } catch (err) { throw err }

  var func = graph.func,
      pipe = graph.pipe,
      task = graph.task

  var cachedLevelOf  = {},
      computeLevelOf = level.bind(null, pipe, cachedLevelOf),
      funcs          = builtinFunctions

  /**
   * Hard copy any additional function.
   */

  function cloneFunction (key) {
    if (typeof additionalFunctions[key] === 'function')
      funcs[key] = additionalFunctions[key]
  }

  if (typeof additionalFunctions === 'object')
    Object.keys(additionalFunctions)
          .forEach(cloneFunction)

  /**
   * Compile each sub graph.
   */

  function compileSubgraph (key) {
    if (typeof funcs[key] === 'undefined')
      funcs[key] = fun(graph.func[key], additionalFunctions)
  }

  if (typeof func === 'object')
    Object.keys(func)
          .forEach(compileSubgraph)

  /**
   * Here we are, this is the ❤ of dflow.
   */

  function dflowFun () {
    var gotReturn = false,
        outs = {},
        returnValue

    var inputArgsOf = inputArgs.bind(null, outs, pipe)

    // Inject builtin tasks.
    injectReferences(funcs, task)
    injectAccessors(funcs, graph)
    injectArguments(funcs, task, arguments)

    /**
     * Sorts tasks by their level.
     */

    function byLevel (a, b) {
      if (typeof cachedLevelOf[a] === 'undefined')
        cachedLevelOf[a] = computeLevelOf(a)

      if (typeof cachedLevelOf[b] === 'undefined')
        cachedLevelOf[b] = computeLevelOf(b)

      return cachedLevelOf[a] - cachedLevelOf[b]
    }

    function run (taskKey) {
      var args     = inputArgsOf(taskKey),
          funcName = task[taskKey],
          f        = funcs[funcName]

      // Behave like a JavaScript function: if found a return, skip all other tasks.
      if (gotReturn)
        return

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      outs[taskKey] = f.apply(null, args)
    }

    Object.keys(task).sort(byLevel).forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph.
  dflowFun.graph = graph

  return dflowFun
}

module.exports = fun

