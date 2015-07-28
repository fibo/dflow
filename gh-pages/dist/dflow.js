require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
// ├── inject/globals.js
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
    funcs['this'] = function () { return dflowFun }
    funcs['this.graph'] = function () { return graph }
    injectAccessors(funcs, graph)
    injectAdditionalFunctions(funcs, additionalFunctions)
    injectArguments(funcs, task, arguments)
    injectReferences(funcs, task)
    injectGlobals(funcs, task)

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


},{"./functions/builtin":2,"./inject/accessors":4,"./inject/additionalFunctions":5,"./inject/arguments":6,"./inject/dotOperators":7,"./inject/globals":8,"./inject/references":9,"./inputArgs":10,"./isDflowFun":12,"./level":13,"./validate":19}],2:[function(require,module,exports){

// Arithmetic operators

function addition (a, b) { return a + b }
exports['+'] = addition

function multiplication (a, b) { return a * b }
exports['*'] = multiplication

function subtraction (a, b) { return a - b }
exports['-'] = subtraction

function division (a, b) { return a / b }
exports['/'] = division

function modulus (a, b) { return a % b }
exports['%'] = modulus

// Logical operators

function and (a, b) { return a && b }
exports['&&'] = and

function or (a, b) { return a || b }
exports['||'] = or

function not (a) { return ! a }
exports['!'] = not

// Comparison operators

function equalTo (a, b) { return a == b }
exports['=='] = equalTo

function equalValueAndEqualType (a, b) { return a === b }
exports['==='] = equalValueAndEqualType

function notEqual (a, b) { return a != b }
exports['!='] = notEqual

function notEqualValueAndEqualType (a, b) { return a !== b }
exports['!=='] = notEqualValueAndEqualType

function greaterThen (a, b) { return a > b }
exports['>'] = greaterThen

function lessThen (a, b) { return a < b }
exports['<'] = lessThen

function greaterThenOrEqualTo (a, b) { return a >= b }
exports['>='] = greaterThenOrEqualTo

function lessThenOrEqualTo (a, b) { return a <= b }
exports['<='] = lessThenOrEqualTo

// Other operators

function applyMethod (fun, thisArg, argsArray) { return fun.apply(thisArg, argsArray) }
exports.apply = applyMethod

function dot (obj, prop) { return obj[prop] }
exports['.'] = dot

function typeofOperator (operand) { return typeof operand }
exports['typeof'] = typeofOperator

// Array

exports['Array.isArray']  = Array.isArray

exports['Array.prototype.filter']  = Array.prototype.filter
exports['Array.prototype.forEach'] = Array.prototype.forEach
exports['Array.prototype.indexOf'] = Array.prototype.indexOf
exports['Array.prototype.join']    = Array.prototype.join
exports['Array.prototype.map']     = Array.prototype.map
exports['Array.prototype.pop']     = Array.prototype.pop
exports['Array.prototype.push']    = Array.prototype.push
exports['Array.prototype.reduce']  = Array.prototype.reduce
exports['Array.prototype.slice']   = Array.prototype.slice
exports['Array.prototype.sort']    = Array.prototype.sort

// console

exports['console.error'] = console.error.bind(console)
exports['console.log']   = console.log.bind(console)

// Date

exports['Date.now']   = Date.now
exports['Date.parse'] = Date.parse

// Function

exports['Function.prototype'] = Function.prototype

// Global

function infinity () { return Infinity }
exports['Infinity'] = infinity

exports.isFinite = isFinite

exports.isNaN = isNaN

function nan () { return NaN }
exports.NaN = nan

function nullValue () { return null }
exports['null'] = nullValue

// JSON

exports['JSON.parse']     = JSON.parse
exports['JSON.stringify'] = JSON.stringify

// Math

function MathE () { return Math.E }
exports['Math.E'] = MathE

function MathLN2 () { return Math.LN2 }
exports['Math.LN2'] = MathLN2

function MathLN10 () { return Math.LN10 }
exports['Math.LN10'] = MathLN10

function MathLOG2 () { return Math.LOG2 }
exports['Math.LOG2'] = MathLOG2

function MathLOG10 () { return Math.LOG10 }
exports['Math.LOG10'] = MathLOG10

function MathPI () { return Math.PI }
exports['Math.PI'] = MathPI

function MathSQRT1_2 () { return Math.SQRT1_2 }
exports['Math.SQRT1_2'] = MathSQRT1_2

function MathSQRT2 () { return Math.SQRT2 }
exports['Math.SQRT2'] = MathSQRT2

exports['Math.abs']    = Math.abs
exports['Math.acos']   = Math.acos
exports['Math.acosh']  = Math.acosh
exports['Math.asin']   = Math.asin
exports['Math.asinh']  = Math.asinh
exports['Math.atan']   = Math.atan
exports['Math.atanh']  = Math.atanh
exports['Math.atan2']  = Math.atan2
exports['Math.cbrt']   = Math.cbrt
exports['Math.ceil']   = Math.ceil
exports['Math.clz32']  = Math.clz32
exports['Math.cos']    = Math.cos
exports['Math.cosh']   = Math.cosh
exports['Math.exp']    = Math.exp
exports['Math.expm1']  = Math.expm1
exports['Math.floor']  = Math.floor
exports['Math.fround'] = Math.fround
exports['Math.hypot']  = Math.hypot
exports['Math.imul']   = Math.imul
exports['Math.log']    = Math.log
exports['Math.logip']  = Math.logip
exports['Math.log10']  = Math.log10
exports['Math.log2']   = Math.log2
exports['Math.max']    = Math.max
exports['Math.min']    = Math.min
exports['Math.pow']    = Math.pow
exports['Math.random'] = Math.random
exports['Math.round']  = Math.round
exports['Math.sign']   = Math.sign
exports['Math.sin']    = Math.sin
exports['Math.sinh']   = Math.sinh
exports['Math.sqrt']   = Math.sqrt
exports['Math.tan']    = Math.tan
exports['Math.tanh']   = Math.tanh
exports['Math.trunc']  = Math.trunc

// Number

function epsilon () { return Number.EPSILON }
exports['Number.EPSILON'] = epsilon

function min_value () { return Number.MIN_VALUE }
exports['Number.MIN_VALUE'] = min_value

function max_value () { return Number.MAX_VALUE }
exports['Number.MAX_VALUE'] = max_value

// Object

exports['Object.freeze']                   = Object.freeze
exports['Object.getOwnPropertyDescriptor'] = Object.getOwnPropertyDescriptor
exports['Object.getOwnPropertyNames']      = Object.getOwnPropertyNames
exports['Object.getPrototypeOf']           = Object.getPrototypeOf
exports['Object.isFrozen']                 = Object.isFrozen
exports['Object.isSealed']                 = Object.isSealed
exports['Object.keys']                     = Object.keys
exports['Object.seal']                     = Object.seal

exports['Object.prototype.defineProperties']     = Object.prototype.defineProperties
exports['Object.prototype.defineProperty']       = Object.prototype.defineProperty
exports['Object.prototype.hasOwnProperty']       = Object.prototype.hasOwnProperty
exports['Object.prototype.isPrototypeOf']        = Object.prototype.isPrototypeOf
exports['Object.prototype.propertyIsEnumerable'] = Object.prototype.propertyIsEnumerable
exports['Object.prototype.toLocaleString']       = Object.prototype.toLocaleString
exports['Object.prototype.toString']             = Object.prototype.toString
exports['Object.prototype.valueOf']              = Object.prototype.valueOf

// String

exports['String.prototype.charAt']            = String.prototype.charAt
exports['String.prototype.charCodeAt']        = String.prototype.charCodeAt
exports['String.prototype.concat']            = String.prototype.concat
exports['String.prototype.indexOf']           = String.prototype.indexOf
exports['String.prototype.lastIndexOf']       = String.prototype.lastIndexOf
exports['String.prototype.repeat']            = String.prototype.repeat
exports['String.prototype.search']            = String.prototype.search
exports['String.prototype.slice']             = String.prototype.slice
exports['String.prototype.split']             = String.prototype.split
exports['String.prototype.substr']            = String.prototype.substr
exports['String.prototype.substring']         = String.prototype.substring
exports['String.prototype.toLocaleLowerCase'] = String.prototype.toLocaleLowerCase
exports['String.prototype.toLocaleUpperCase'] = String.prototype.toLocaleUpperCase
exports['String.prototype.toLowerCase']       = String.prototype.toLowerCase
exports['String.prototype.toUpperCase']       = String.prototype.toUpperCase
exports['String.prototype.trim']              = String.prototype.trim


},{}],3:[function(require,module,exports){

exports.Audio = function () { return window.Audio }

exports.document = function _document () { return document }

exports['document.body'] = function body () { return document.body }

exports['document.head'] = function head () { return document.head }

exports.window = function _window () { return window }


},{}],4:[function(require,module,exports){

var accessorRegex = require('../regex/accessor')

/**
 * Inject functions to set or get context keywords.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectAccessors (funcs, graph) {
  if (typeof graph.data === 'undefined')
    graph.data = {}

  /**
   * Inject accessor.
   */

  function inject (taskKey) {
    var accessorName,
        taskName = graph.task[taskKey]

    /**
     * Accessor-like function.
     */

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


},{"../regex/accessor":15}],5:[function(require,module,exports){

/**
 * @params {Object} funcs
 * @params {Object} additionalFunctions
 */

function injectAdditionalFunctions (funcs, additionalFunctions) {
  // Nothing to do if no additional function is given.
  if (typeof additionalFunctions === 'undefined')
    return

  /**
   * Validate and insert an additional function.
   */

  function injectAdditionalFunction (key) {
    var isAFunction  = typeof additionalFunctions[key] === 'function'

    if (isAFunction)
      funcs[key] = additionalFunctions[key]
  }

  Object.keys(additionalFunctions)
        .forEach(injectAdditionalFunction)
}

module.exports = injectAdditionalFunctions


},{}],6:[function(require,module,exports){

var argumentRegex = require('../regex/argument')

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

  /**
   * Inject arguments.
   */

  function inject (taskKey) {
    var funcName = task[taskKey]

    if (funcName === 'arguments') {
      funcs[funcName] = function getArguments () { return args }
    }
    else {
      var arg = argumentRegex.exec(funcName)

      if (arg)
        funcs[funcName] = getArgument.bind(null, arg[1])
    }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectArguments


},{"../regex/argument":16}],7:[function(require,module,exports){

var dotOperatorRegex = require('../regex/dotOperator')

/**
 * Inject functions that emulate dot operator.
 *
 * @api private
 *
 * @param {Object} funcs reference
 * @param {Object} graph
 */

function injectDotOperators (funcs, graph) {

  /**
   * Inject dot operator.
   */

  function inject (taskKey) {
    var taskName = graph.task[taskKey]

    /**
     * Dot operator function.
     *
     * @param {String} attributeName
     * @param {Object} obj
     * @param {...} rest of arguments
     *
     * @returns {*} result
     */

    function dotOperatorFunc (attributeName, obj) {
      var func

      if (typeof obj === 'object')
        func = obj[attributeName]

      if (typeof func === 'function')
        return func.apply(obj, Array.prototype.slice.call(arguments, 2))
    }

    if (dotOperatorRegex.func.test(taskName)) {
      // .foo() -> foo
      attributeName = taskName.substring(1, taskName.length - 2)

      funcs[taskName] = dotOperatorFunc.bind(null, attributeName)
    }

    /**
     * Dot operator attribute.
     *
     * @param {String} attributeName
     * @param {Object} obj
     *
     * @returns {*} attribute
     */

    function dotOperatorAttr (attributeName, obj) {
      var attr

      if (typeof obj === 'object')
        attr = obj[attributeName]

      if (typeof attr === 'function')
        return attr.bind(obj)

      return attr
    }

    if (dotOperatorRegex.attr.test(taskName)) {
      // .foo -> foo
      attributeName = taskName.substring(1)

      funcs[taskName] = dotOperatorAttr.bind(null, attributeName)
    }
  }

  Object.keys(graph.task).forEach(inject)
}

module.exports = injectDotOperators


},{"../regex/dotOperator":17}],8:[function(require,module,exports){
(function (global){

/**
 * Inject globals.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectGlobals (funcs, task) {
  function inject (taskKey) {
    var taskName = task[taskKey]

    // Do not overwrite a function if already defined.
    // For example, console.log cannot be used as is, it must binded to console.
    if (typeof funcs[taskName] === 'function')
      return

    // Skip also reserved keywords.
    if (taskName === 'return')
      return

    var globalContext

    if (typeof window === 'object')
      globalContext = window

    if (typeof global === 'object')
      globalContext = global

    /**
     * Walk through global context.
     *
     * process.version will return global[process][version]
     *
     * @param {String} taskName
     * @returns {*} leaf
     */

    function walk (taskName) {
      function toNextProp (leaf, prop) { return leaf[prop] }

      return taskName.split('.')
                     .reduce(toNextProp, globalContext)
    }

    var globalValue = walk(taskName)

    if (typeof globalValue === 'undefined')
      return

    if (typeof globalValue === 'function')
      funcs[taskName] = globalValue
    else
      funcs[taskName] = function () { return globalValue }
  }

  Object.keys(task).forEach(inject)
}

module.exports = injectGlobals


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){

var referenceRegex = require('../regex/reference')

/**
 * Inject references to functions.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function injectReferences (funcs, task) {
  function inject (taskKey) {
    var referenceName

    var taskName = task[taskKey]

    /**
     * Inject reference.
     */

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


},{"../regex/reference":18}],10:[function(require,module,exports){

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


},{"./inputPipes":11}],11:[function(require,module,exports){

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


},{}],12:[function(require,module,exports){

var validate = require('./validate')

/**
 * Duct tape for dflow functions.
 *
 * @param {Function} f
 *
 * @returns {Boolean} ok, it looks like a dflowFun
 */

function isDflowFun (f) {
  var isFunction     = typeof f === 'function',
      hasGraphObject = typeof f.graph === 'object',
      hasFuncsObject = typeof f.funcs === 'object',
      hasValidGraph  = false

  if (isFunction && hasGraphObject && hasFuncsObject)
    hasValidGraph = validate(f.graph, f.funcs)

  return hasValidGraph
}

module.exports = isDflowFun


},{"./validate":19}],13:[function(require,module,exports){

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


},{"./parents":14}],14:[function(require,module,exports){

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


},{"./inputPipes":11}],15:[function(require,module,exports){

module.exports = /^@(.+)$/


},{}],16:[function(require,module,exports){

module.exports = /^arguments\[(\d+)\]$/


},{}],17:[function(require,module,exports){

exports.attr = /^\.([a-zA-Z_$][0-9a-zA-Z_$]+)$/

exports.func = /^\.([a-zA-Z_$][0-9a-zA-Z_$]+)\(\)$/


},{}],18:[function(require,module,exports){

module.exports = /^\&(.+)$/


},{}],19:[function(require,module,exports){

var accessorRegex    = require('./regex/accessor'),
    argumentRegex    = require('./regex/argument'),
    dotOperatorRegex = require('./regex/dotOperator'),
    referenceRegex   = require('./regex/reference')

/**
 * Check graph consistency.
 *
 * @param {Object} graph
 * @param {Object} [additionalFunctions]
 *
 * @returns {Boolean} ok if no exception is thrown
 */

function validate (graph, additionalFunctions) {
  // Required properties.
  var pipe = graph.pipe,
      task = graph.task

  // Optional properties.
  var data = graph.data || {},
      func = graph.func || {},
      info = graph.info || {}

  var seenPipe = {}

  // Validate addition functions, if any.
  // Check there are no reserved keys.

  function throwIfEquals (taskName, reservedKey) {
    if (taskName === reservedKey)
      throw new TypeError('Reserved function name: ' + taskName)
  }

  if (typeof additionalFunctions === 'object') {
    for (var taskName in additionalFunctions) {
      var reservedKeys = ['return', 'arguments', 'this', 'this.graph'],
          throwIfEqualsTaskName = throwIfEquals.bind(null, taskName)

      reservedKeys.forEach(throwIfEqualsTaskName)

      if (argumentRegex.test(taskName))
        throw new TypeError('Reserved function name: ' + taskName)

      if (accessorRegex.test(taskName))
        throw new TypeError('Function name cannot start with "@": ' + taskName)

      if (dotOperatorRegex.attr.test(taskName))
        throw new TypeError('Function name cannot start with ".":' + taskName)

      if (dotOperatorRegex.func.test(taskName))
        throw new TypeError('Function name cannot start with "." and end with "()":' + taskName)

      if (referenceRegex.test(taskName))
        throw new TypeError('Function name cannot start with "&": ' + taskName)
    }
  }

  // Check pipe and task are objects.

  if (typeof pipe !== 'object')
    throw new TypeError('Not an object: pipe', pipe)

  if (typeof task !== 'object')
    throw new TypeError('Not an object: task', task)

  // Check optional data, func, info and view are objects.

  if (typeof data !== 'object')
    throw new TypeError('Not an object: data', data)

  if (typeof func !== 'object')
    throw new TypeError('Not an object: func', func)

  if (typeof info !== 'object')
    throw new TypeError('Not an object: info', info)


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


},{"./regex/accessor":15,"./regex/argument":16,"./regex/dotOperator":17,"./regex/reference":18}],"dflow":[function(require,module,exports){

var windowFunctions = require('./functions/window'),
    fun             = require('./fun')

function funBrowser (graph) {
  var additionalFunctions = arguments[1] || {}

  function inject (key) {
    additionalFunctions[key] = windowFunctions[key]
  }

  Object.keys(windowFunctions).forEach(inject)

  return fun(graph, additionalFunctions)
}

exports.fun = funBrowser


},{"./fun":1,"./functions/window":3}]},{},[]);
