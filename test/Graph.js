
var assert = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Graph   = dflow.Graph
var Node    = dflow.Node

var graph = new Graph()

describe('Graph', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var graph = new Graph()
      assert.ok(graph instanceof Graph)
    })

    it('sets task argument')

    describe('arguments', function () {
      describe('nodes', function () {
        it('defaults to []',function () {
          assert.deepEqual(graph.getNodes(), [])
        })
      })
    })
  })

  describe('Inheritance', function () {
    it('is a Node', function () {
      assert.ok(graph instanceof Node)
    })
  })

  describe('Methods', function () {
    describe('getGraphs()', function () {
      it('returns the graphs contained in the graph', function () {
        var graph = new Graph()
   
        var graph1 = graph.pushGraph()
        assert.deepEqual(graph.getGraphs(), [graph1])

        var graph2 = new Graph()
        graph.pushGraph(graph2)
        assert.deepEqual(graph.getGraphs(), [graph1, graph2])

        var graph3 = graph.pushGraph()
        assert.deepEqual(graph.getGraphs(), [graph1, graph2, graph3])
      })
    })
   
    describe('getGraphById()', function () {
      it('returns a subgraph given by its id')
    })

    describe('getNodes()', function () {
      it('returns the nodes in the graph', function () {
        var graph = new Graph()
   
        var node1 = graph.pushNode()
        assert.deepEqual(graph.getNodes(), [node1])

        var node2 = new Node()
        graph.pushNode(node2)
        assert.deepEqual(graph.getNodes(), [node1, node2])

        var node3 = graph.pushNode()
        assert.deepEqual(graph.getNodes(), [node1, node2, node3])
      })
    })
   
    describe('getNodeById()', function () {
      it('returns a node given by its id')
    })

    describe('deleteGraph()', function () {
      it('deletes given graph', function () {
        var graph = new Graph()
        var graph = new Graph()
        graph.pushGraph(graph)
        graph.deleteGraph(graph)
        var graphs = graph.getGraphs()
        assert.deepEqual(graphs, [])
      })

      it('coerces id to graph', function () {
        var graph = new Graph()
        var graph = new Graph()
        graph.pushGraph(graph)
        var graphId = graph.getId()
        graph.deleteGraph(graphId)
        var graphs = graph.getGraphs()
        assert.deepEqual(graphs, [])
      })
    })
   
    describe('deleteNode()', function () {
      it('deletes given node', function () {
        var graph = new Graph()
        var node = new Node()
        graph.pushNode(node)
        graph.deleteNode(node)
        var nodes = graph.getNodes()
        assert.deepEqual(nodes, [])
      })

      it('coerces id to node', function () {
        var graph = new Graph()
        var node = new Node()
        graph.pushNode(node)
        var nodeId = node.getId()
        graph.deleteNode(nodeId)
        var nodes = graph.getNodes()
        assert.deepEqual(nodes, [])
      })
    })
   
    describe('pushGraph()', function () {
      it('creates an empty graph if no arg is provided', function () {
        var graph = new Graph()
        var subgraph = graph.pushGraph()
        assert.ok(subgraph instanceof Graph)
      })

      it('accepts a graph as first argument', function () {
        var graph = new Graph()
        var subgraph = new Graph()
        graph.pushGraph(subgraph)
        var graphs = graph.getGraphs()
        assert.ok(subgraph === graphs[0])
      })

      it('coerces object to graph')
    })

    describe('pushNode()', function () {
      it('creates an empty node if no arg is provided', function () {
        var graph = new Graph()
        var node = graph.pushNode()
        assert.ok(node instanceof Node)
      })

      it('accepts a node as first argument', function () {
        var graph = new Graph()
        var node = new Node()
        graph.pushNode(node)
        var nodes = graph.getNodes()
        assert.ok(node === nodes[0])
      })

      it('coerces object to node')
    })

    describe('graphToJSON()', function () {
      it('returns graph in JSON format', function () {
        var arg = {}
          , json = {}
        arg.name = json.name = 'myGraph'
        json.inputs = []
        json.outputs = []
        var node = new Node()
        arg.nodes = []
        json.nodes = []
        arg.nodes.push(node)
        json.nodes.push(node.nodeToJSON())
        var graph = new Graph(arg)
        json.id = graph.getId()
        assert.deepEqual(json, graph.graphToJSON())
      })
    })

    describe('toJSON()', function () {
      it('is an alias of graphToJSON', function () {
        assert.ok(graph.toJSON === graph.graphToJSON)
      })
    })
  })
})

