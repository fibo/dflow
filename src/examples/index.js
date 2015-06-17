
var graphs = {}

graphs['hello-world'] = require('./hello-world.json')

exports.graphs = graphs

function render (divId, example) {
  var graph = graphs[example]
  require('flow-view').render(divId)(graph)
  require('dflow').fun(graph)()
}

exports.render = render

