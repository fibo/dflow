
var dflow = require('../index')
  , iper = require('iper')

var DflowGraph = dflow.DflowGraph
  , DflowNode  = dflow.DflowNode
  , DflowTask  = dflow.DflowTask
  , IperNode   = iper.IperNode

var graph = new DflowGraph()
var node = new DflowNode(graph)

describe('DflowTask', function () {
  describe('Inheritance', function () {
    it('is an IperNode', function () {
      node.should.be.instanceOf(IperNode)
    })
  })

  describe('Constructor', function () {})
  describe('Attributes', function () {})
  describe('Methods', function () {})
})

