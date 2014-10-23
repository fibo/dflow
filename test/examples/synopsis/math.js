
var dflow = require('dflow')

var graph = {
  task: {
    '0': { func: 'arguments[0]' },
    '1': { func: 'cos' },
    '2': { func: 'return' }
  },
  pipe: {
    '3': { from: '0', to: '1', arg: 0 },
    '4': { from: '1', to: '2', arg: 0 }
  }
}

var f = dflow.func(Math, graph)

console.log(f(0.5))

