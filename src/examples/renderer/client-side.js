var Canvas = require('flow-view').Canvas
var dflow = require('dflow')
var graphs = require('../graphs')

/**
 * Render example into given div and execute dflow graph.
 *
 * @param {String} divId
 * @param {String} example
 *
 * @returns {undefined}
 */

function renderExample (divId, example) {
  var graph = graphs[example]

  var canvas = new Canvas(divId)

  canvas.render(graph.view)

  dflow.fun(graph)()
}

module.exports = renderExample
