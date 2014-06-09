
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

      graph = new dflow.Graph()

      graph.addTask('Math.PI')

      graph.evaluate()

      graph.tasks[0].out.should.be.eql(wrongPI)
    })
  })
})
