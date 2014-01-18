
var dflow  = require('../index')
  , iper   = require('iper')
  , should = require('should')

var DflowEdge = dflow.DflowEdge
  , DflowTask  = dflow.DflowTask

var defaultTask = new DflowTask()

describe('DflowTask', function () {
  describe('Constructor', function () {
    it('has signature `()`', function () {
      var task = new DflowTask()

      task.should.be.instanceOf(DflowTask)
    })

    it('has signature `(graph)`')/*, function () {
      var task = new DflowTask(graph)

      task.should.be.instanceOf(DflowTask)
    })*/
  })

  describe('Attributes', function () {
    describe('#graph', function () {
      it('defaults to an empty IperGraph')/*, function () {
        var graph = defaultTask.graph

        graph.should.be.instanceOf(IperGraph)

        graph.isEmpty.should.be(true)
      })*/
    })
  })

  describe('Methods', function() {
    describe('#createInput()', function () {})

    describe('#createTask()', function () {
      it('has signature `(function)`')/*, function () {
        var task = new DflowTask()

        task.should.be.instanceOf(DflowTask)
      })*/

      it('has signature `(taskName)`')
    })
  })
})

