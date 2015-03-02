
function exportIt (name) {
  var graph = require('./' + name + '.json')

  graph.results = require('./' + name + '-results.json')

  exports[name] = graph
}

[
  'apply',
  'dotOperator',
  'sum'
].forEach(exportIt)

