
var dflow = require('../index')

var graph = dflow.emptyGraph()

var task1, task2, task3
  , pipe1, pipe2

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

      task1 = task
    })

    it('does not require arg', function () {
      name = '+'
      task = dflow.addTask(graph, name)

      task.arg.should.eql([])
      task.name.should.eql(name)
      task.id.should.be.a.Number

      task2 = task
    })
  })

  describe('pipe', function () {
    var pipe, source, target, argIndex

    it('works', function () {
      argIndex = 0
      source = task1
      target = task2

      pipe = dflow.addPipe(graph, source, target, argIndex)
    })

    it('return a pipe', function () {
      pipe.sourceId.should.eql(task1.id)
      pipe.targetId[0].should.eql(task2.id)
      pipe.targetId[1].should.eql(argIndex)
      pipe.id.should.be.a.Number

      pipe1 = pipe
    })

    it('does not require argIndex', function () {
      source = task1
      target = task2

      pipe = dflow.addPipe(graph, source, target)

      pipe.sourceId.should.eql(task1.id)
      pipe.targetId[0].should.eql(task2.id)
      pipe.targetId[1].should.eql(argIndex + 1)
      pipe.id.should.be.a.Number

      pipe2 = pipe
    })
  })
})
