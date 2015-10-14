
var should = require('should'),
    fun    = require('../src/engine/fun')


describe('this', function () {
  var graph = {
    task: {
      '1': 'this.graph',
      '2': 'return'
    },
    pipe: {
      'a': [ '1', '2' ]
    }
  }

  var f = fun(graph)

  it('is a dflow builtin that returns the function itself', function () {
    should.deepEqual(f(), graph)
  })
})

describe('this.graph', function () {
  var graph = {
    task: {
      '1': 'this',
      '2': 'return'
    },
    pipe: {
      'a': [ '1', '2' ]
    }
  }

  var f = fun(graph)

  it('is a dflow builtin that returns the graph', function () {
    f().should.be.a.Function

    // Yep, f is a function that returns itself
    should.deepEqual(f()(), f()()())
  })
})
