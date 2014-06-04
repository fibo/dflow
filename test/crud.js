
var dflow = require('../index')

var graph = dflow.emptyGraph()

describe('add', function () {
  describe('task', function () {
    var task, name, arg

    it('works', function () {
      arg = [1]
      name = 'number'

      task = dflow.addTask(graph, name, arg)
    })

    it('return a task', function () {
      task.arg.should.eql(arg)
      task.name.should.eql(name)
      task.id.should.be.a.Number
    })
  })

  describe('pipe', function () {
    var pipe, source, target, argIndex

    it('works', function () {
      name = 'number'

      pipe = dflow.addPipe(graph, source, target, argIndex)
    })
  })
})
