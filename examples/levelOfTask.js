
var dflow = require('dflow')
  , graph = require('./graph1.json')

graph.tasks.forEach(function (task) {
  console.log(dflow.levelOfTask(graph, task))
})
