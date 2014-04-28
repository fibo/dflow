
var dflow = require('../index')
  , should = require('should')

var DflowGraph = dflow.DflowGraph
  , DflowTask  = dflow.DflowTask

describe('DflowTask', function () {
  describe('Inheritance', function () {
    it('is a DflowTask', function () {
      var graph = new DflowGraph()

      graph.should.be.instanceOf(DflowTask)
    })
  })

  describe('Attribute', function () {
    describe('#edges', function () {
    })
  })

  describe('Method', function () {
    describe('#createTask()', function () {
    })
  })
})

