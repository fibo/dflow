
var should = require('should')
  , func = require('../src/func')

var graph = {
  pipe: {
    'a': { from: '0', to: '2', arg: 0 },
    'b': {  from: '1', to: '2', arg: 1 },
    'c': {  from: '2', to: '3', arg: 0 }
  },
  task: {
    '0': { func: 'arguments[0]' },
    '1': { func: 'arguments[1]' },
    '2': { func: '+' },
    '3': { func: 'return' }
  }
}

var funcs = {
  '+': function (a, b) { return a + b }
}

var f = func(funcs, graph)

describe('func', function () {
  it('returns a function with a graph prop', function () {
    f.should.be.instanceOf(Function)
    f(1, 2).should.eql(3)
    f.graph.should.eql(graph)
  })
})

