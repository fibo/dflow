
var dflow = require('dflow');

// A JSON that represents the execution graph.
var graph = {
  "task": {
    "1": "arguments[0]",
    "2": "console.log"
  },
  "pipe": {
    "3": [ "1", "2" ]
  }
}

// Create a function.
var f = dflow.fun(graph)

f('Hello World') // prints "Hello World"

