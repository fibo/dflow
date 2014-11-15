
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

// A collection of functions.
var funcs = {
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b }
  // arguments[0] will be injected by dflow.func
}

// Create a function.
var f = dflow.fun(graph, funcs)

f('Hello World') // prints "Hello World"

