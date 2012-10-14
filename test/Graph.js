
var assert = require('assert');
//var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Graph = dflow.Graph;

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
  });

  describe('addNode(<Node>)', function () {
  });
});

