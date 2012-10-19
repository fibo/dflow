
var assert = require('assert');
//var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Graph = dflow.Graph;
var Node  = dflow.Node;

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

  describe('getNodes()', function () {
    it('', function () {
      var graph = new Graph();
      var arg = {
        task: function () {
          graph.emit('task');
        }
      };
      graph.addNode(arg);
      graph.addNode(arg);
      graph.addNode(arg);

      var nodes = graph.getNodes();

      assert.equal(nodes.length, 3);
    });
  });

  describe('addNode(<Object>)', function () {
    it('coerces Object to Node', function () {
      var graph = new Graph();
      var arg = {
        task: function () {
          graph.emit('task');
        }
      };
      graph.addNode(arg);

      var nodes = graph.getNodes();

      assert.ok(nodes[0] instanceof Node);
    });
  });
});

