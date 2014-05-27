
var dflow = require('dflow')
  , graph = require('./graph1.json')

dflow.register('Math.min', Math.min)
dflow.register('Math.max', Math.max)
dflow.register('console.log', console.log)

console.log(JSON.stringify(dflow.evaluate(graph), null, 4))
