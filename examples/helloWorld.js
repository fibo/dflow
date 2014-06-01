
var dflow = require('dflow')

// Create a graph with a single task and say "Hello world"

var graph = {
  tasks: [
    {
      name: 'console.log',
      arg: ['Hello', 'world']
    }
  ],
  pipes: []
}

dflow.evaluate(graph)
// Hello world

