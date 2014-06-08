
var dflow = require('../index')

var graph, task

describe('register', function () {
  describe('global', function () {
    it('coerces to function', function () {
      dflow.register('Math.PI').should.be.Function
    })
  })

  describe('custom', function () {
    it('can override global', function () {
      var wrongPI = 3

      dflow.register('Math.PI', wrongPI)

      graph = dflow.emptyGraph()

      task = dflow.addTask(graph, 'Math.PI')

      graph.tasks.push(task)

      graph = dflow.evaluate(graph)

      graph.tasks[0].out.should.be.eql(wrongPI)
    })
  })
})
