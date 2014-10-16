
function validate (funcs, graph) {
  for (var i in funcs)
    if (typeof funcs[i] !== 'function')
      throw new TypeError('Not a Function:', i, funcs[i])

  if (!Array.isArray(graph.pipes))
    throw new TypeError('Not an Array:', 'graph.pipes', graph.pipes)
  
  if (!Array.isArray(graph.tasks))
    throw new TypeError('Not an Array:', 'graph.tasks', graph.tasks)

  graph.tasks.forEach(function () {})
}

module.exports = validate

