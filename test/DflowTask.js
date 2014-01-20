
var dflow  = require('../index')
  , iper   = require('iper')
  , should = require('should')

var DflowGraph = dflow.DflowGraph
  , DflowHost  = dflow.DflowHost
  , DflowTask  = dflow.DflowTask

var host = new DflowHost()
var graph = new DflowGraph(host)

var obj = {
  info: {
    pkg: 'Foo',
    name: 'Bar'
  },
  task: function () {},
  inputs: [],
  outputs: []
}

var task = new DflowTask(graph, obj)

describe('DflowTask', function () {
  describe('Constructor', function () {
    it('has signature `(graph, {task, inputs, outputs, info})`', function () {
      task.should.be.instanceOf(DflowTask)
    })
  })

  describe('Attributes', function () {
    describe('#graph', function () {
      it('is a DflowGraph', function () {
        task.graph.should.be.instanceOf(DflowGraph)
      })
    })

    describe('#task', function () {
      it('is a Function', function () {
        task.task.should.be.a.Function

        ;(function () {
          var task2 = new DflowTask(graph, {
            task: 'not a function',
            inputs: [],
            outputs: []
          })
        }).should.throwError()
      })
    })
  })

  describe('Methods', function() {
    describe('#createInput()', function () {})
  })
})

