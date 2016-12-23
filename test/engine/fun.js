var should = require('should')

var fun = require('engine/fun')

describe('fun', function () {
  it('returns a function', function () {
    var graph = {
      task: {
        '0': 'arguments[0]',
        '1': 'arguments[1]',
        '2': '/sum',
        '3': '@three',
        '4': '*',
        '5': '@result',
        '6': 'return',
        '7': '// this is a comment',
        // The following tasks do not contribute to result.
        // They are added to test there are no conflicts with
        // global tasks resolution.
        'a': "'This is a string with a.dot'",
        'b': '// This is a comment with a.dot',
        'c': '&Math.cos',
        'd': '1.2'
      },
      pipe: {
        'a': [ '0', '2', 0 ],
        'b': [ '1', '2', 1 ],
        'c': [ '2', '4', 0 ],
        'd': [ '3', '4', 1 ],
        'e': [ '4', '5' ],
        'f': [ '5', '6' ]
      },
      func: {
        sum: {
          pipe: {
            'a': [ '0', '2', 0 ],
            'b': [ '1', '2', 1 ],
            'c': [ '2', '3' ]
          },
          task: {
            '0': 'arguments[0]',
            '1': 'arguments[1]',
            '2': 'custom + operator',
            '3': 'return'
          }
        }
      },
      data: {
        three: 3
      },
      view: {}
    }

    var funcs = {
      'custom + operator': function (a, b) { return a + b }
    }

    var f = fun(graph, funcs)

    f.should.be.instanceOf(Function)
    f(1, 2).should.eql(9)
    f.graph.should.eql(graph)
    f.graph.data.result.should.eql(9)
  })

  it('accepts an empty graph', function () {
    var emptyGraph = {
      task: {},
      pipe: {}
    }

    var empty = fun(emptyGraph)

    should.deepEqual(empty.graph, emptyGraph)
  })

  it('can use dflow functions as tasks', function () {
    var graph = {
      task: {
        '1': 'dflow.fun',
        '2': 'dflow.isDflowFun',
        '3': 'dflow.validate'
      },
      pipe: {}
    }

    fun(graph)
  })

  it('throws if graph is not valid', function () {
    ;(function () {
      var graphWithOrphanPipe = {
        task: {
          '3': 'return'
        },
        pipe: {
          '1': [ '2', '3' ]
        }
      }

      fun(graphWithOrphanPipe)
    }).should.throwError(/Orphan pipe:/)
  })

  it('throws if a task is not compiled', function () {
    ;(function () {
      var graphWithTaskNotFound = {
        task: {
          '2': 'available task',
          '3': 'foo'
        },
        pipe: {
          '1': [ '2', '3' ]
        }
      }

      var funcs = {
        'available task': function () { return 'ok' }
      }

      fun(graphWithTaskNotFound, funcs)
    }).should.throwError(/Task not compiled:/)
  })
})
