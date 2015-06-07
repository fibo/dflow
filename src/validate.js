
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

