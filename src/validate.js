
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
    var arg = pipe[key].arg
      , from = pipe[key].from
      , to = pipe[key].to

    // Check pipe props type is valid.

    if (typeof arg !== 'number')
      throw new TypeError('Not a number: pipe', key, 'arg', arg)

    if (typeof from !== 'string')
      throw new TypeError('Not a string: pipe', key, 'from', from)

    if (typeof to !== 'string')
      throw new TypeError('Not a string: pipe', key, 'to', to)

    // Check for orphan pipes

    if (typeof task[from] === 'undefined')
      throw new Error('Orphan pipe', pipe[key])

    if (typeof task[to] === 'undefined')
      throw new Error('Orphan pipe', pipe[key])

    // Remember pipes, avoid duplicates.

    if (typeof seenPipe[from] === 'undefined')
      seenPipe[from] = {}

    if (typeof seenPipe[from][to] === 'undefined')
      seenPipe[from][to] = []

    if (typeof seenPipe[from][to][arg] === 'undefined')
      seenPipe[from][to][arg] = true
    else
      throw new Error('Duplicated pipe', pipe[key])
  }

  Object.keys(pipe).forEach(checkPipe)

  return true
}

module.exports = validate

