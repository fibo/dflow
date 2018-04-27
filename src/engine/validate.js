var no = require('not-defined')
var regexAccessor = require('./regex/accessor')
var regexArgument = require('./regex/argument')
var regexDotOperator = require('./regex/dotOperator')
var regexReference = require('./regex/reference')
var reservedKeys = require('./reservedKeys')
var regexSubgraph = require('./regex/subgraph')

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
  var pipe = graph.pipe
  var task = graph.task

  // Optional properties.
  var data = graph.data || {}
  var func = graph.func || {}
  var info = graph.info || {}

  var seenPipe = {}

  // Validate addition functions, if any.
  // Check there are no reserved keys.

  function throwIfEquals (taskName, reservedKey) {
    if (taskName === reservedKey) {
      throw new TypeError('Reserved function name: ' + taskName)
    }
  }

  if (typeof additionalFunctions === 'object') {
    for (var taskName in additionalFunctions) {
      var throwIfEqualsTaskName = throwIfEquals.bind(null, taskName)

      reservedKeys.forEach(throwIfEqualsTaskName)

      if (regexArgument.test(taskName)) {
        throw new TypeError('Reserved function name: ' + taskName)
      }

      if (regexAccessor.test(taskName)) {
        throw new TypeError('Function name cannot start with "@": ' + taskName)
      }

      if (regexDotOperator.attrRead.test(taskName)) {
        throw new TypeError('Function name cannot start with ".":' + taskName)
      }

      if (regexDotOperator.attrWrite.test(taskName)) {
        throw new TypeError('Function name cannot start with "." and end with "=":' + taskName)
      }

      if (regexDotOperator.func.test(taskName)) {
        throw new TypeError('Function name cannot start with "." and end with "()":' + taskName)
      }

      if (regexReference.test(taskName)) {
        throw new TypeError('Function name cannot start with "&": ' + taskName)
      }
    }
  }

  // Check pipe and task are objects.

  if (typeof pipe !== 'object') {
    throw new TypeError('Not an object: pipe ' + pipe)
  }

  if (typeof task !== 'object') {
    throw new TypeError('Not an object: task ' + task)
  }

  // Check optional data, func, info and view are objects.

  if (typeof data !== 'object') {
    throw new TypeError('Not an object: data ' + data)
  }

  if (typeof func !== 'object') {
    throw new TypeError('Not an object: func ' + func)
  }

  if (typeof info !== 'object') {
    throw new TypeError('Not an object: info ' + info)
  }

  function checkPipe (key) {
    var arg = pipe[key][2] || 0
    var from = pipe[key][0]
    var to = pipe[key][1]

    // Check types.

    if (typeof arg !== 'number') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    if (typeof from !== 'string') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    if (typeof to !== 'string') {
      throw new TypeError('Invalid pipe: ' + pipe[key])
    }

    // Check for orphan pipes.

    if (no(task[from])) throw new Error('Orphan pipe: ' + pipe[key])

    if (no(task[to])) throw new Error('Orphan pipe: ' + pipe[key])

    // Remember pipes, avoid duplicates.

    if (no(seenPipe[from])) seenPipe[from] = {}

    if (no(seenPipe[from][to])) seenPipe[from][to] = []

    if (no(seenPipe[from][to][arg])) seenPipe[from][to][arg] = true
    else throw new Error('Duplicated pipe: ' + pipe[key])
  }

  Object.keys(pipe)
    .forEach(checkPipe)

  // Check that every subgraph referenced are defined.

  function onlySubgraphs (key) {
    var taskName = task[key]

    return regexSubgraph.test(taskName)
  }

  function checkSubgraph (key) {
    var taskName = task[key]

    var funcName = taskName.substring(1)

    if (no(func[funcName])) throw new Error('Undefined subgraph: ' + funcName)
  }

  Object.keys(task)
    .filter(onlySubgraphs)
    .forEach(checkSubgraph)

  // Recursively check subgraphs in func property.

  function checkFunc (key) {
    validate(func[key], additionalFunctions)
  }

  if (typeof func === 'object') {
    Object.keys(func)
      .forEach(checkFunc)
  }

  return true
}

module.exports = validate
