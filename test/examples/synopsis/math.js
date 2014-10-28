
var dflow = require('dflow')

var graph = {
  task: {
    'a': 'arguments[0]',
    'b': 'cos',
    'c': 'return'
  },
  pipe: {
    '1': ['a', 'b'],
    '2': ['b', 'c']
  }
}

var f = dflow.fun(Math, graph)

console.log(f(0.5))

