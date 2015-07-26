
//
// Dependency graph
//
// fun.js
// ├── builtinFunctions.js
// ├── inject/accessors.js
// │   └── regex/accessors.js
// ├── inject/additionalFunctions.js
// ├── inject/arguments.js
// │   └── regex/arguments.js
// ├── inject/dotOperator.js
// │   └── regex/dotOperator.js
// ├── inject/references.js
// │   └── regex/references.js
// ├── inputArgs.js
// │   └── inputPipes.js
// ├── isDflowFun.js
// ├── level.js
// │   └── parents.js
// │       └── inputPipes.js
// └── validate.js
//     ├── regex/accessors.js
//     ├── regex/arguments.js
//     ├── regex/dotOperator.js
//     └── regex/references.js
//

var builtinFunctions          = require('./functions/builtin'),
    injectAdditionalFunctions = require('./inject/additionalFunctions'),
    injectArguments           = require('./inject/arguments'),
    injectAccessors           = require('./inject/accessors'),
    injectDotOperators        = require('./inject/dotOperators'),
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

  // Expose dflow functions.
  funcs['dflow.fun']              = fun
  funcs['dflow.isDflowFun']       = isDflowFun
  funcs['dflow.validate']         = validate

  /**
   * Compile each sub graph.
   */

  function compileSubgraph (key) {
    if (typeof funcs[key] === 'undefined')
      funcs[key] = fun(graph.func[key], additionalFunctions)
  }

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
    injectAccessors(funcs, graph)
    injectAdditionalFunctions(funcs, additionalFunctions)
    injectArguments(funcs, task, arguments)
    injectReferences(funcs, task)
    funcs['this'] = function () { return dflowFun }
    funcs['this.graph'] = function () { return graph }

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

