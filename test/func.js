
var should = require('should')
  , func = require('../src/func')

var graph = {
  pipes: [
    { id: 'a', from: { id: '0' }, to: { id: '2', arg: 0 } },
    { id: 'b', from: { id: '1' }, to: { id: '2', arg: 1 } },
    { id: 'c', from: { id: '2' }, to: { id: '3', arg: 0 } }
  ],
  tasks: [
    { id: '0', func: 'arguments[0]' },
    { id: '1', func: 'arguments[1]' },
    { id: '2', func: '+' },
    { id: '3', func: 'return' }
  ]
}

var funcs = {
  '+': function (a, b) { return a + b }
}

var f = func(funcs, graph)

describe('func', function () {
  it('returns a function with a graph prop', function () {
    f.should.be.instanceOf(Function)
    f.graph.should.eql(graph)
  f()
  })

  it('function returns some value', function () {
    f(1, 2).should.eql(3)
  })
})

