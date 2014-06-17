
/**
 * # Usage
 *
 * Display layout of example graph examples/graphs/XYZ.json
 *
 * ```
 * node examples/graphLayout.js XYZ
 * ```
 *
 */

var dflow = require('dflow')
  , graph = require('./graphs/' + process.argv[2] + '.json')

var layout = dflow.arrange(graph)
console.log(JSON.stringify(layout, null, 4))

