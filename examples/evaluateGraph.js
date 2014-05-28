
var dflow = require('dflow')
  , graph = require('./graph1.json')

console.log(JSON.stringify(dflow.evaluate(graph), null, 4))

