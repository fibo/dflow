
var validate = require('../src/validate')

var should = require('should')

var graph = {
  pipes: [],
  tasks: []
}
var funcs = {
  'f': Function.prototype
}

describe('validate', function () {
  it('throws if some prop of funcs is not a function', function () {
    ;(function () {
      validate({'foo': 'bar'}, graph)
    }).should.throwError(/Not a Function:/)
  })

  it('throws if graph.tasks is not an Array', function () {
    graph = {
      pipes: [],
      tasks: 'not an array'
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(/Not an Array:/)
  })

  it('throws if graph.pipes is not an Array', function () {
    graph = {
      tasks: [],
      pipes: 'not an array'
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(/Not an Array:/)
  })
})

