
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Slot = dflow.Slot;

describe('Slot', function () {
  describe('constructor:', function () {
    it('requires data arg', function () {
      var slot1 = new Slot({data:2});
      assert.ok(slot1 instanceof Slot);

      var slot2 = new Slot({data:'xx'});
      assert.ok(slot2 instanceof Slot);

      var slot3 = new Slot({data:[]});
      assert.ok(slot3 instanceof Slot);

      var slot4 = new Slot({data:{}});
      assert.ok(slot4 instanceof Slot);

      // TODO ha senso che data sia una funzione?
      // TODO ci sono altri tipi di dato in nodejs?
    });
  });

  describe('inheritance:', function () {
    it('is an EventEmitter', function () {
      var slot = new Slot(0);
      assert.ok(slot instanceof EventEmitter);
    });
  });
});

