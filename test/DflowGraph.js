
var dflow = require('../index')

var DflowGraph = dflow.Graph

var graph = new DflowGraph()

var task1, task2, task3
  , pipe1, pipe2

describe('DflowGraph', function () {
  describe('constructor', function () {
    it('create an empty graph', function () {
      graph.tasks.should.be.Array
      graph.pipes.should.be.Array
    })
  })

  describe('method', function () {
    describe('addTask()', function () {
      var task, name, arg

      it('works', function () {
        arg = [1]
        name = 'number'

        task = graph.addTask(name, arg)
      })

      it('return a task', function () {
        task.arg.should.eql(arg)
        task.name.should.eql(name)
        task.id.should.be.a.Number

        task1 = task
      })

      it('does not require arg', function () {
        name = '+'
        task = graph.addTask(name)

        task.arg.should.eql([])
        task.name.should.eql(name)
        task.id.should.be.a.Number

        task2 = task
      })
    })

    describe('addPipe()', function () {
      var pipe, argIndex

      it('works', function () {
        argIndex = 0

        pipe = graph.addPipe(task1, task2, argIndex)
      })

      it('return a pipe', function () {
        pipe.from.should.eql(task1.id)
        pipe.to[0].should.eql(task2.id)
        pipe.to[1].should.eql(argIndex)
        pipe.id.should.be.a.Number

        pipe1 = pipe
      })

      it('does not require argIndex', function () {
        pipe = graph.addPipe(task1, task2)

        pipe.from.should.eql(task1.id)
        pipe.to[0].should.eql(task2.id)
        pipe.to[1].should.eql(argIndex + 1)
        pipe.id.should.be.a.Number

        pipe2 = pipe
      })
    })
  })
})
