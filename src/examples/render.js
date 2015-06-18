
var dflow    = require('dflow'),
    examples = require('./index'),
    flowView = require('flow-view')

/**
 * Render example into given div.
 *
 * @param {String} divId
 * @param {String} example
 *
 * @returns {Object} graph
 */

function render (divId, example) {
  var graph = examples[example]

  flowView.render(divId)(graph)

  return graph
}

module.exports = render

