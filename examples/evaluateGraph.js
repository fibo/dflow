
/**
 * # Usage
 *
 * Evaluate example graph examples/graphs/XYZ.json
 *
 * ```
 * node examples/evaluateGraph.js XYZ
 * ```
 *
 */

var dflow = require('dflow')
  , graph = require('./graphs/' + process.argv[2] + '.json')

dflow.evaluate(graph)
//console.log(JSON.stringify(dflow.evaluate(graph), null, 4))

