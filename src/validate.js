
function validate (funcs, graph) {
  for (var i in funcs)
    if (typeof funcs[i] !== 'function')
      throw new TypeError('Not a Function:', i, funcs[i])

  if (!Array.isArray(graph.pipes))
    throw new TypeError('Not an Array:', 'graph.pipes', graph.pipes)
  
  if (!Array.isArray(graph.tasks))
    throw new TypeError('Not an Array:', 'graph.tasks', graph.tasks)

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
}

module.exports = validate

