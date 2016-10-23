var write = require('write-file-utf8')

var emptyGraph = require('./emptyGraph.json')

/**
 * @param {String} graphPath
 * @param {Function} [callback]
 * @returns {void}
 */

function createEmptyGraph (graphPath, callback) {
  var jsonString = JSON.stringify(emptyGraph)

  write(graphPath, jsonString, callback)
}

module.exports = createEmptyGraph
