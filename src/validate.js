
function validate (funcs, graph) {
  funcs['arguments[0]'] = Function.prototype

  for (var i in funcs) {
    // Ignore arguments[N] function names, they will be injected.
    if (/^arguments\[\d+\]$/.exec(i))
      continue

    var f = funcs[i]

    if (typeof f !== 'function')
      throw new TypeError('Not a Function:', i, f)
  }

  if (!Array.isArray(graph.pipes))
    throw new TypeError('Not an Array:', 'graph.pipes', graph.pipes)
  
  if (!Array.isArray(graph.tasks))
    throw new TypeError('Not an Array:', 'graph.tasks', graph.tasks)

  function isDefined (prop) {
    if (typeof this[prop] === 'undefined')
      throw new TypeError('Missing prop:', prop, this)
  }

  function checkProps (props, obj) {
    props.forEach(isDefined.bind(obj))
  }

  graph.pipes.forEach(checkProps.bind(null, ['id', 'from', 'to']))
  graph.tasks.forEach(checkProps.bind(null, ['id', 'func']))

  function checkFunc (task) {
    var f = funcs[task.func]

    if (typeof f !== 'function')
      throw new TypeError('Not a Function:', task.func, f)
  }

  graph.tasks.forEach(checkFunc)

  function checkOrphan (pipe) {
    var isOrphan = true

    graph.tasks.forEach(function (task) {
      if (!isOrphan)
        return

      if (pipe.from.id === task.id)
        isOrphan = false

      if (pipe.to.id === task.id)
        isOrphan = false
    })

    if (isOrphan)
      throw new TypeError('Orphan pipe:', pipe)
  }

  graph.pipes.forEach(checkOrphan)

  return true
}

module.exports = validate

