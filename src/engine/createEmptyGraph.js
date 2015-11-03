var fs = require('fs')

var emptyGraph = require('./emptyGraph.json')

/**
 *
 * @param {String} graphPath
 * @param {Function} [callback]
 */

function createEmptyGraph (graphPath, callback) {
  var jsonString = JSON.stringify(emptyGraph)

  fs.writeFile(graphPath, jsonString, 'utf8', function (err) {
    if (err) throw err

    if (typeof callback === 'function') callback()
  })
}

module.exports = createEmptyGraph
