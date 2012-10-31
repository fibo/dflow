
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Element = dflow.Element;
var Node    = dflow.Node;

var doNothing = function () {}

var dummy = {task: doNothing};

describe('Node', function () {
  describe('constructor:', function () {
    it('requires a task function', function () {
      var newNode1 = function () { new Node(); }
      assert.throws(newNode1, Error);

      var newNode2 = function () { new Node({}); }
      assert.throws(newNode2, Error);

      var newNode3 = function () { new Node({task:'foo'}); }
      assert.throws(newNode3, Error);

      var newNode4 = function () { new Node(dummy); }
      assert.doesNotThrow(newNode4, Error);
    });

    it('does not require ins and outs, which default to []', function () {
      var newNode = function () { new Node(dummy); }
      assert.doesNotThrow(newNode, Error);

      var node = new Node(dummy);
      assert.deepEqual(node.getIns(), []);
      assert.deepEqual(node.getOuts(), []);
    });
  });

  describe('inheritance:', function () {
    it('is an Element', function () {
      var node = new Node(dummy);
      assert.ok(node instanceof Element);
    });

    it('is an EventEmitter', function () {
      var node = new Node(dummy);
      assert.ok(node instanceof EventEmitter);
    });
  });
});

