
var should = require('should')
  , func = require('../src/func')

var graph = {
  pipes: [
    { key: 'a', from: { key: '0' }, to: { key: '2', arg: 0 } },
    { key: 'b', from: { key: '1' }, to: { key: '2', arg: 1 } },
    { key: 'c', from: { key: '2' }, to: { key: '3', arg: 0 } }
  ],
  tasks: [
    { key: '0', func: 'arguments[0]' },
    { key: '1', func: 'arguments[1]' },
    { key: '2', func: '+' },
    { key: '3', func: 'return' }
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

