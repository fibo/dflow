
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Element = dflow.Element;
var Graph   = dflow.Graph;
var Node    = dflow.Node;

describe('Graph', function () {
  describe('constructor:', function () {
    it('requires no argument', function () {
      var graph = new Graph();
      assert.ok(graph instanceof Graph);
    });

    it('nodes defaults to []', function () {
      var graph = new Graph();
      assert.deepEqual(graph.getNodes(), []);
    });
  });

  describe('inheritance:', function () {
    it('is a Node', function () {
      var graph = new Graph();
      assert.ok(graph instanceof Node);
    });

    it('is an Element', function () {
      var graph = new Graph();
      assert.ok(graph instanceof Element);
    });

    it('is an EventEmitter', function () {
      var graph = new Graph();
      assert.ok(graph instanceof EventEmitter);
    });
  });

  describe('getNodes()', function () {
    it('returns the nodes in the graph', function () {
      var graph = new Graph();

      var node1 = graph.addNode();
      var node2 = graph.addNode();
      var node3 = graph.addNode();

      var nodes = graph.getNodes();

      assert.deepEqual(graph.getNodes(), [node1, node2, node3]);
    });
  });

  describe('addNode()', function () {
    it('creates an empty node if no arg is provided', function () {
      var graph = new Graph();

      var node = graph.addNode();

      assert.ok(node instanceof Node);
    });
  });

  describe('delNode()', function () {
    it('', function () {
    });
  });

  describe('toJSON()', function () {
    it('', function () {
    });
  });
});

