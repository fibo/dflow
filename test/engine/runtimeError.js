var fun = require('engine/fun')

describe('runtime error', function () {
  it('stops execution of next tasks', function () {
    var count = 1
    var err = 'ok'
    var graph = {
      task: {
        a: 'throwError',
        b: 'shouldNotRun'
      },
      pipe: {
        c: ['a', 'b']
      }
    }

    var additionalFunctions = {
      throwError: function () {
        throw new Error(err)
      },
      shouldNotRun: function () {
        count++
      }
    }

    var f = fun(graph, additionalFunctions)

    ;(function () {
      f()
    }).should.throwError(err)

    count.should.be.eql(1)
  })

  it('enrichs error with task info', function () {
    var graph = {
      task: {
        a: 'throwError'
      },
      pipe: {}
    }

    var additionalFunctions = {
      throwError: function () {
        throw new Error()
      }
    }

    var f = fun(graph, additionalFunctions)

    try {
      f()
    } catch (err) {
      err.taskKey.should.eql('a')
      err.taskName.should.eql('throwError')
    }
  })
})
