
var validate = require('../src/validate')

var should = require('should')

var graph = {
  pipes: [],
  tasks: []
}
var funcs = {
  'f': Function.prototype
}

var notArray = /Not an Array:/
  , notFunction = /Not a Function:/
  , orphanPipe = /Orphan pipe:/

describe('validate', function () {
  it('throws if some prop of funcs is not a function', function () {
    ;(function () {
      validate({'foo': 'bar'}, graph)
    }).should.throwError(notFunction)
  })

  it('throws if graph.tasks is not an Array', function () {
    graph = {
      pipes: [],
      tasks: 'not an array'
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(notArray)
  })

  it('throws if graph.pipes is not an Array', function () {
    graph = {
      tasks: [],
      pipes: 'not an array'
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(notArray)
  })

  it('throws if a task has not a valid func', function () {
    graph = {
      tasks: [
        {
          'id': '1',
          'func': 'not a function'
        }
      ],
      pipes: []
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(notFunction)
  })

  it('throws if a pipe is orphan', function () {
    graph = {
      tasks: [
      ],
      pipes: [
        {
          'id': '1',
          'from': { id: '2' },
          'to': { id: '3', arg: 0 },
        }
      ]
    }

    ;(function () {
      validate(funcs, graph)
    }).should.throwError(orphanPipe)
  })
})

