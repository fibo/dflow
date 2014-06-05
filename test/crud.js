
var dflow  = require('../index')
  , should = require('should')

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
    var pipe, argIndex

    it('works', function () {
      argIndex = 0

      pipe = dflow.addPipe(graph, task1, task2, argIndex)
    })

    it('return a pipe', function () {
      pipe.from.should.eql(task1.id)
      pipe.to[0].should.eql(task2.id)
      pipe.to[1].should.eql(argIndex)
      pipe.id.should.be.a.Number

      pipe1 = pipe
    })

    it('does not require argIndex', function () {
      pipe = dflow.addPipe(graph, task1, task2)

      pipe.from.should.eql(task1.id)
      pipe.to[0].should.eql(task2.id)
      pipe.to[1].should.eql(argIndex + 1)
      pipe.id.should.be.a.Number

      pipe2 = pipe
    })
  })
})
