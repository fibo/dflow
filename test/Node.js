
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var w2 = require('../index.js');

var Node = w2.Node;

describe('Node', function () {
  describe('constructor:', function () {
    //var node = new Node({task:dummy});
    it('requires a task function', function () {
      var newNode1 = function () { new Node(); }
      assert.throws(newNode1, Error);

      var newNode2 = function () { new Node({}); }
      assert.throws(newNode2, Error);

      var newNode3 = function () { new Node({task:'foo'}); }
      assert.throws(newNode3, Error);

      var dummy = function () {};
      var newNode4 = function () { new Node({task:dummy}); }
      assert.doesNotThrow(newNode4, Error);
    });
  });

  describe('inheritance:', function () {
    it('is an EventEmitter', function () {
      var node = new Node({task:function(){}});
      assert.ok(node instanceof EventEmitter);
    });
  });
});

