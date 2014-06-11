
/*
 * usage:
 *
 * node examples/evaluateGraph.js XYZ
 *
 * will launch examples/graphXYZ.json
 *
 */

var dflow = require('dflow')
  , graph = require('./graphs/' + process.argv[2] + '.json')


dflow.use(dflow.plugin.core)

dflow.evaluate(graph)
//console.log(JSON.stringify(dflow.evaluate(graph), null, 4))

