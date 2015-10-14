
var builtinFunctions          = require('./functions/builtin'),
    injectAdditionalFunctions = require('./inject/additionalFunctions'),
    injectArguments           = require('./inject/arguments'),
    injectAccessors           = require('./inject/accessors'),
    injectDotOperators        = require('./inject/dotOperators'),
    injectGlobals             = require('./inject/globals'),
    injectReferences          = require('./inject/references'),
    inputArgs                 = require('./inputArgs'),
    isDflowFun                = require('./isDflowFun'),
    level                     = require('./level'),
    validate                  = require('./validate')

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
  try { validate(graph, additionalFunctions) }
  catch (err) { throw err }

  var func = graph.func || {},
      pipe = graph.pipe,
      task = graph.task

  var cachedLevelOf  = {},
      computeLevelOf = level.bind(null, pipe, cachedLevelOf),
      funcs          = builtinFunctions

  /**
   * Compile each sub graph.
   */

  function compileSubgraph (key) {
    if (typeof funcs[key] === 'undefined')
      funcs[key] = fun(graph.func[key], additionalFunctions)
  }

  // Inject compile-time builtin tasks.

  funcs['dflow.fun']        = fun
  funcs['dflow.isDflowFun'] = isDflowFun
  funcs['dflow.validate']   = validate

  injectGlobals(funcs, task)
  injectAccessors(funcs, graph)
  injectAdditionalFunctions(funcs, additionalFunctions)
  injectDotOperators(funcs, task)
  injectReferences(funcs, task)

  Object.keys(func)
        .forEach(compileSubgraph)

  /**
   * Here we are, this is the ❤ of dflow.
   */

  function dflowFun () {
    var gotReturn = false,
        outs = {},
        returnValue

    var startMessage = 'fun start'
    if (typeof graph.info !== 'undefined') startMessage += graph.info

    var inputArgsOf = inputArgs.bind(null, outs, pipe)

    // Inject run-time builtin tasks.

    funcs['this'] = function () { return dflowFun }
    funcs['this.graph'] = function () { return graph }
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

    /**
     * Execute task.
     */

    function run (taskKey) {
      var args     = inputArgsOf(taskKey),
          funcName = task[taskKey],
          f        = funcs[funcName]

      // Behave like a JavaScript function:
      // if found a return, skip all other tasks.
      if (gotReturn)
        return

      if ((funcName === 'return') && (!gotReturn)) {
        returnValue = args[0]
        gotReturn = true
        return
      }

      if (typeof f === 'undefined')
        throw new TypeError('Task ' + funcName + ' [' + taskKey + '] is not defined')

      outs[taskKey] = f.apply(null, args)
    }

    // Run every graph task, sorted by level.
    Object.keys(task)
          .sort(byLevel)
          .forEach(run)

    return returnValue
  }

  // Remember function was created from a dflow graph.
  dflowFun.graph = graph

  return dflowFun
}

module.exports = fun
