
var dflow = require('dflow')
  , graph = require('./graph1.json')

// TODO dflow.loadJSON
// dflow.addTask
// dflow.pipeTasks
// dflow task 'dflow.levelOfTask'
graph.tasks.forEach(function (task) {
  console.log(dflow.levelOfTask(graph, task))
})

