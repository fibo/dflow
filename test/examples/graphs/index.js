
function exportIt (name) {
  var graph = require('./' + name + '.json')

  graph.results = require('./' + name + '-results.json')

  exports[name] = graph
}

[
  'apply',
  'empty',
  'dotOperator',
  'sum'
].forEach(exportIt)

