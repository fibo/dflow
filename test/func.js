
var should = require('should')
  , dflow = require('..')

var graph = {
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
    dflow.func(graph, funcs).should.be.instanceOf(Function)
  })
})

