
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Slot = dflow.Slot;

describe('Slot', function () {
  describe('inheritance:', function () {
    it('is an EventEmitter', function () {
      var slot = new Slot();
      assert.ok(slot instanceof EventEmitter);
    });
  });
});

