
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

