(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dflow = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

function typeofOperator (operand) { return typeof operand }

exports['typeof'] = typeofOperator

//function method0 (obj, method) { return obj[method]() }

//function method1 (obj, method, arg1) { return obj[method](arg1) }

//function method2 (obj, method, arg1, arg2) { return obj[method](arg1, arg2) }

//exports['method2'] = method2

function applyMethod (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) }

exports.apply = applyMethod

function nullValue () { return null }

exports['null'] = nullValue

function dot (obj, prop) { return obj[prop] }

exports['.'] = dot

// Arithmetic operators.

function addition (a, b) { return a + b }

exports['+'] = addition

function multiplication (a, b) { return a * b }

exports['*'] = multiplication

function subtraction (a, b) { return a - b }

exports['-'] = subtraction

function division (a, b) { return a / b }

exports['/'] = division

// Logical operators.

function and (a, b) { return a && b }

exports['&&'] = and

function or (a, b) { return a || b }

exports['||'] = or

// console.

exports['console.log'] = console.log.bind(console)

// Math.

exports['Math.cos'] = Math.cos
exports['Math.sin'] = Math.sin


},{}],2:[function(require,module,exports){

var builtinFunctions = require('./builtinFunctions')
  , injectArguments  = require('./injectArguments')
  , injectAccessors  = require('./injectAccessors')
  , injectReferences = require('./injectReferences')
  , inputArgs        = require('./inputArgs')
  , level            = require('./level')
  , validate         = require('./validate')

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

  var func = graph.func
    , pipe = graph.pipe
    , task = graph.task

  var cachedLevelOf = {}
    , computeLevelOf = level.bind(null, pipe, cachedLevelOf)

  var funcs = builtinFunctions

  function cloneFunction (key) {
    if (typeof additionalFunctions[key] === 'function')
      funcs[key] = additionalFunctions[key]
  }

  if (typeof additionalFunctions === 'object')
    Object.keys(additionalFunctions)
          .forEach(cloneFunction)

  function compileSubgraph (key) {
    if (typeof funcs[key] === 'undefined')
      funcs[key] = fun(graph.func[key], additionalFunctions)
  }

  if (typeof func === 'object')
    Object.keys(func)
          .forEach(compileSubgraph)

  function dflowFun () {
    var gotReturn = false
      , outs = {}
      , returnValue

    var inputArgsOf = inputArgs.bind(null, outs, pipe)

    // Inject builtin tasks.
    injectReferences(funcs, task)
    injectAccessors(funcs, graph)
    injectArguments(funcs, task, arguments)

    function byLevel (a, b) {
      if (typeof cachedLevelOf[a] === 'undefined')
        cachedLevelOf[a] = computeLevelOf(a)

      if (typeof cachedLevelOf[b] === 'undefined')
        cachedLevelOf[b] = computeLevelOf(b)

      return cachedLevelOf[a] - cachedLevelOf[b]
    }

    function run (taskKey) {
      var args = inputArgsOf(taskKey)
        , funcName = task[taskKey]
        , f = funcs[funcName]

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


},{"./builtinFunctions":1,"./injectAccessors":3,"./injectArguments":4,"./injectReferences":5,"./inputArgs":6,"./level":8,"./validate":10}],3:[function(require,module,exports){

/**
 * Inject functions to set or get context keywords.
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectAccessors (funcs, graph) {
  if (typeof graph.data === 'undefined')
    graph.data = {}

  function inject (taskKey) {
    var accessorName,
        accessorRegex = /^\.(.+)$/,
        taskName      = graph.task[taskKey]

    function accessor () {
      if (arguments.length === 1)
        graph.data[accessorName] = arguments[0]

      return graph.data[accessorName]
    }

    if (accessorRegex.test(taskName)) {
      accessorName = taskName.substring(1)

      funcs[taskName] = accessor
    }
  }

  Object.keys(graph.task).forEach(inject)
}

module.exports = injectAccessors


},{}],4:[function(require,module,exports){

/**
 * Inject functions to retrieve arguments.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 * @param {Object} args
 */

function injectArguments (funcs, task, args) {
  function getArgument (index) {
    return args[index]
  }

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    }
    else {
      var argumentRegex = /^arguments\[(\d+)\]$/

      var arg = argumentRegex.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, arg[1])
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectArguments


},{}],5:[function(require,module,exports){

/**
 * Inject references to functions.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {
  function inject (taskKey) {
    var referenceName,
        referenceRegex = /^\&(.+)$/,
        taskName       = task[taskKey]

    function reference () {
      return funcs[referenceName]
    }

    if (referenceRegex.test(taskName)) {
      referenceName = taskName.substring(1)

      funcs[taskName] = reference
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectReferences


},{}],6:[function(require,module,exports){

var inputPipes = require('./inputPipes')

/**
 * Retrieve input arguments of a task.
 *
 * @param {Object} outs
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Array} args
 */

function inputArgs (outs, pipe, taskKey) {
  var args = []
    , inputPipesOf = inputPipes.bind(null, pipe)
  
  function populateArg (inputPipe) {
    var index = inputPipe[2] || 0
      , value = outs[inputPipe[0]]

    args[index] = value
  }

  inputPipesOf(taskKey).forEach(populateArg)

  return args
}

module.exports = inputArgs


},{"./inputPipes":7}],7:[function(require,module,exports){

/**
 * Compute pipes that feed a task.
 *
 * @param {Object} pipe
 * @param {String} taskKey
 *
 * @returns {Array} pipes
 */

function inputPipes (pipe, taskKey) {
  var pipes = []

  function pushPipe (key) {
    pipes.push(pipe[key])
  }

  function ifIsInputPipe (key) {
    return pipe[key][1] === taskKey 
  }

  Object.keys(pipe).filter(ifIsInputPipe).forEach(pushPipe)

  return pipes
}

module.exports = inputPipes


},{}],8:[function(require,module,exports){

var parents = require('./parents')

/**
 * Compute level of task.
 *
 * @param {Object} pipe
 * @param {Object} cachedLevelOf
 * @param {String} taskKey
 *
 * @returns {Number} taskLevel
 */

function level (pipe, cachedLevelOf, taskKey) {
  var taskLevel = 0
    , parentsOf = parents.bind(null, pipe)

  if (typeof cachedLevelOf[taskKey] === 'number')
    return cachedLevelOf[taskKey]

  function computeLevel (parentTaskKey) {
                                 // ↓ Recursion here: the level of a task is the max level of its parents + 1.
    taskLevel = Math.max(taskLevel, level(pipe, cachedLevelOf, parentTaskKey) + 1)
  }

  parentsOf(taskKey).forEach(computeLevel)

  cachedLevelOf[taskKey] = taskLevel

  return taskLevel
}

module.exports = level


},{"./parents":9}],9:[function(require,module,exports){

var inputPipes = require('./inputPipes')

/**
 * Compute parent tasks.
 *
 * @param {Array} pipes of graph
 * @param {String} taskKey
 *
 * @returns {Array} parentTaskIds
 */

function parents (pipe, taskKey) {
  var inputPipesOf = inputPipes.bind(null, pipe)
    , parentTaskIds = []

  function pushParentTaskId (pipe) {
    parentTaskIds.push(pipe[0])
  }

  inputPipesOf(taskKey).forEach(pushParentTaskId)

  return parentTaskIds
}

module.exports = parents


},{"./inputPipes":7}],10:[function(require,module,exports){

/**
 * Check graph consistency.
 *
 * @param {Object} graph
 * @param {Object} [additionalFunctions]
 *
 * @returns {Boolean} ok if no exception is thrown
 */

function validate (graph, additionalFunctions) {
  var func     = graph.func,
      pipe     = graph.pipe,
      task     = graph.task,
      seenPipe = {}

  if (typeof additionalFunctions === 'object') {
    for (var taskName in additionalFunctions) {
      var accessorRegex  = /^\.(.+)$/,
          argumentRegex  = /^arguments\[(\d+)\]$/,
          referenceRegex = /^\&(.+)$/

      if (taskName === 'return')
        throw new TypeError('Reserved function name')

      if (taskName === 'arguments')
        throw new TypeError('Reserved function name')

      if (argumentRegex.test(taskName))
        throw new TypeError('Reserved function name')

      if (accessorRegex.test(taskName))
        throw new TypeError('Function name cannot start with a dot')

      if (referenceRegex.test(taskName))
        throw new TypeError('Function name cannot start with an ampersand')
    }
  }

  // Check pipe and task are objects.

  if (typeof pipe !== 'object')
    throw new TypeError('Not an object: pipe', pipe)

  if (typeof task !== 'object')
    throw new TypeError('Not an object: task', task)


  function checkPipe (key) {
    var arg  = pipe[key][2] || 0,
        from = pipe[key][0],
        to   = pipe[key][1]

    // Check types.

    if (typeof arg !== 'number')
      throw new TypeError('Invalid pipe:', pipe[key])

    if (typeof from !== 'string')
      throw new TypeError('Invalid pipe:', pipe[key])

    if (typeof to !== 'string')
      throw new TypeError('Invalid pipe:', pipe[key])

    // Check for orphan pipes.

    if (typeof task[from] === 'undefined')
      throw new Error('Orphan pipe:', pipe[key])

    if (typeof task[to] === 'undefined')
      throw new Error('Orphan pipe:', pipe[key])

    // Remember pipes, avoid duplicates.

    if (typeof seenPipe[from] === 'undefined')
      seenPipe[from] = {}

    if (typeof seenPipe[from][to] === 'undefined')
      seenPipe[from][to] = []

    if (typeof seenPipe[from][to][arg] === 'undefined')
      seenPipe[from][to][arg] = true
    else
      throw new Error('Duplicated pipe:', pipe[key])
  }

  Object.keys(pipe).forEach(checkPipe)

  // Recursively check subgraphs in func property.

  function checkFunc (key) {
    validate(func[key], additionalFunctions)
  }

  if (typeof func === 'object')
    Object.keys(func).forEach(checkFunc)

  return true
}

module.exports = validate


},{}],11:[function(require,module,exports){

//
// Dependency graph
//
// fun.js
// ├── injectAccessors.js
// ├── injectArguments.js
// ├── injectReferences.js
// ├── inputArgs.js
// │   └── inputPipes.js
// ├── level.js
// │   └── parents.js
// │       └── inputPipes.js
// └── validate.js
//

exports.fun = require('./src/fun')


},{"./src/fun":2}]},{},[11])(11)
});