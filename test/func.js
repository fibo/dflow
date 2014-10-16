
var should = require('should')
  , dflow = require('..')

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
    var f = dflow.func(funcs, graph)
    f.should.be.instanceOf(Function)
    f()
  })
})

