
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var w2 = require('../index.js');

var Node = w2.Node;

describe('Node', function () {
  describe('constructor:', function () {
    it('requires task', function () {
      //var node = new Node();
      //assert.throws;
    });
  });

  describe('inheritance:', function () {
    it('EventEmitter', function () {
      var node = new Node({task:function(){}});
      assert.ok(node instanceof EventEmitter);
    });
  });
});

