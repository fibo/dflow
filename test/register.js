
var dflow = require('../index')

var graph, task

describe('register', function () {
  describe('global', function () {


  })

  describe('custom', function () {
    it('does not override global', function () {
      dflow.register('Math.PI', 3)

      var graph = dflow.emptyGraph()

      task = dflow.addTask(graph, 'Math.PI')

      graph.tasks.push(task)

      graph = dflow.evaluate(graph)

      graph.tasks[0].out.should.be.eql(Math.PI)
    })
  })
})
