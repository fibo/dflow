
var should = require('should')
  , func = require('../src/func')

var graph = {
  pipes: [],
  tasks: [
    {
      id: '1',
      func: '+'
    }
  ]
}

var funcs = {
  '+': function (a, b) { return a + b }
}

describe('func', function () {
  it('returns a function', function () {
    var f = func(funcs, graph)
    f.should.be.instanceOf(Function)
    f()
  })

  it('validates funcs and graph', function () {
    funcs.foo = 'bar'

    ;(function () {
      func(funcs, graph)
    }).should.throwError()
  })
})

