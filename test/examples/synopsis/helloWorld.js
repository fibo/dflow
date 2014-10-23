
var dflow = require('dflow');

// A JSON that represents the execution graph.
var graph = {
  "task": {
    "1": { "func": "arguments[0]" },
    "2": { "func": "console.log" }
  },
  "pipe": {
    "3": { "from": "1", "to": "2", "arg": 0 }
  }
}

// A collection of functions.
var funcs = {
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b }
  // arguments[0] will be injected by dflow.func
}

// Create a function.
var f = dflow.func(funcs, graph)

f('Hello World') // prints "Hello World"

