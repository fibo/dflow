var dflow = require('dflow')

// A JSON that represents the execution graph.
var graph = {
  task: {
    a: 'arguments[0]',
    b: 'console.log'
  },
  pipe: {
    c: [ 'a', 'b' ]
  }
}

// Create a function.
var f = dflow.fun(graph)

f('Hello World') // prints "Hello World"
