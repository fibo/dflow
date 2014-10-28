
var should = require('should')
  , fun = require('../src/fun')

var graph = {
  pipe: {
    'a': [ '0', '2', 0 ],
    'b': [ '1', '2', 1 ],
    'c': [ '2', '3', 0 ]
  },
  task: {
    '0': 'arguments[0]',
    '1': 'arguments[1]',
    '2': '+',
    '3': 'return'
  }
}

var funcs = {
  '+': function (a, b) { return a + b }
}

var f = fun(funcs, graph)

describe('fun', function () {
  it('returns a function with a graph prop', function () {
    f.should.be.instanceOf(Function)
    f(1, 2).should.eql(3)
    f.graph.should.eql(graph)
  })
})

