!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.dflow=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//
// Dependency graph
//
// fun.js
// ├── injectArguments.js
// ├── inputArgs.js
// │   └── inputPipes.js
// ├── level.js
// │   └── parents.js
// │       └── inputPipes.js
// └── validate.js
//

exports.fun = require('./src/fun')


},{"./src/fun":5}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){

// Use *debug* package if available.

var debug

try {
  debug = require('debug')
}
catch (err) {
  debug = require('./debugNoop')
}

module.exports = debug


},{"./debugNoop":4,"debug":2}],4:[function(require,module,exports){

function debugNoop () { return Function.prototype }

module.exports = debugNoop


},{}],5:[function(require,module,exports){

var debug = require('./debug')('dflow:fun')

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

  var cachedLevelOf = {}
    , computeLevelOf = level.bind(null, graph.pipe, cachedLevelOf)

  function dflowFun () {
    var gotReturn = false
      , outs = {}
      , returnValue

    var inputArgsOf = inputArgs.bind(null, outs, graph.pipe)

    funcs = injectArguments(funcs, graph.task, arguments)

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

        debug('taskKey', taskKey)
        debug('funcName', funcName)

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


},{"./debug":3,"./injectArguments":6,"./inputArgs":7,"./level":9,"./validate":11}],6:[function(require,module,exports){

/**
 * Inject functions to retrieve arguments.
 *
 * @param {Object} funcs
 * @param {Object} task
 * @param {Object} args
 *
 * @returns {Object} funcs enriched with arguments[N] funcs
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
      var argumentsN = /^arguments\[(\d+)\]$/
      var arg = argumentsN.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, arg[1])
    }
  }

  Object.keys(task).forEach(inject)

  return funcs
}

module.exports = injectArguments


},{}],7:[function(require,module,exports){

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


},{"./inputPipes":8}],8:[function(require,module,exports){

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


},{}],9:[function(require,module,exports){

var debug = require('./debug')('dflow:level')

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

  debug('task "' + taskKey + '" has level ' + taskLevel)

  cachedLevelOf[taskKey] = taskLevel

  return taskLevel
}

module.exports = level


},{"./debug":3,"./parents":10}],10:[function(require,module,exports){

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


},{"./inputPipes":8}],11:[function(require,module,exports){

/**
 * Check graph consistency.
 *
 * @param {Object} graph
 *
 * @returns {Boolean} ok if no exception is thrown
 */

function validate (graph) {
  var pipe = graph.pipe
    , task = graph.task
    , seenPipe = {}

  // Check pipe and task are objects.

  if (typeof pipe !== 'object')
    throw new TypeError('Not an object: pipe', pipe)

  if (typeof task !== 'object')
    throw new TypeError('Not an object: task', task)


  function checkPipe (key) {
    var arg = pipe[key][2] || 0
      , from = pipe[key][0]
      , to = pipe[key][1]

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

  return true
}

module.exports = validate


},{}]},{},[1])(1)
});