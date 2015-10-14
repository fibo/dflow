
var processFunctions = require('../functions/process'),
    fun              = require('../fun')

function funProcess (graph) {
  var additionalFunctions = arguments[1] || {}

  function inject (key) {
    additionalFunctions[key] = processFunctions[key]
  }

  Object.keys(processFunctions).forEach(inject)

  return fun(graph, additionalFunctions)
}

exports.fun = funProcess

