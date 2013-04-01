
var assert = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element
var Graph   = dflow.Graph
var Node    = dflow.Node

var graph = new Graph()

describe('Graph', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var graph = new Graph()
      assert.ok(graph instanceof Graph)
    })

    it('nodes defaults to []', function () {
      assert.deepEqual(graph.getNodes(), [])
    })
  })

  describe('Inheritance', function () {
    it('is a Node', function () {
      assert.ok(graph instanceof Node)
    })
  })

  describe('Methods', function () {
    describe('getNodes()', function () {
      it('returns the nodes in the graph', function () {
        var graph = new Graph()
   
        var node1 = graph.addNode()
        var node2 = graph.addNode()
        var node3 = graph.addNode()
   
        assert.deepEqual(graph.getNodes(), [node1, node2, node3])
      })
    })
   
    describe('addNode()', function () {
      it('creates an empty node if no arg is provided', function () {
        var graph = new Graph()
   
        var node = graph.addNode()
   
        assert.ok(node instanceof Node)
      })
    })
   
    describe('delNode()', function () {
      it('', function () {
      })
    })
   
    describe('graphToJSON()', function () {
      it('', function () {
      })
    })

    describe('toJSON()', function () {
      it('is an alias of graphToJSON', function () {
        assert.ok(graph.toJSON === graph.graphToJSON)
      })
    })
  })
})

