
var should = require('should'),
    fun    = require('../src/engine/fun')

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

  it('can use dflow functions as tasks', function (){
    var graph = {
          task: {
            '1': 'dflow.fun',
            '2': 'dflow.isDflowFun',
            '3': 'dflow.validate'
          },
          pipe: {}
        }

    var f = fun(graph)
  })
})

