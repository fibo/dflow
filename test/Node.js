
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var w2 = require('../index.js');

var Node = w2.Node;

describe('Node', function () {
  describe('constructor:', function () {
    var dummy = function () {};

    it('requires a task function', function () {
      var newNode1 = function () { new Node(); }
      assert.throws(newNode1, Error);

      var newNode2 = function () { new Node({}); }
      assert.throws(newNode2, Error);

      var newNode3 = function () { new Node({task:'foo'}); }
      assert.throws(newNode3, Error);

      var newNode4 = function () { new Node({task:dummy}); }
      assert.doesNotThrow(newNode4, Error);
    });

    it('does not require ins and outs, which default to []', function () {
      var newNode = function () { new Node({task:dummy}); }
      assert.doesNotThrow(newNode, Error);

      var node = new Node({task:dummy});
      assert.deepEqual(node.getIns(), []);
      assert.deepEqual(node.getOuts(), []);
    });
  });

  describe('inheritance:', function () {
    it('is an EventEmitter', function () {
      var node = new Node({task:function(){}});
      assert.ok(node instanceof EventEmitter);
    });
  });
});

