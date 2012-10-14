
var assert = require('assert');
//var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var In = dflow.In;
var Slot = dflow.Slot;

describe('In', function () {
  describe('constructor:', function () {
    it('', function () {
    });
  });

  describe('inheritance:', function () {
    it('is a Slot', function () {
      var _in = new In();
      assert.ok(_in instanceof Slot);
    });
  });

  describe('getSource()', function () {
    it('', function () {
    });
  });

  describe('getData()', function () {
    it('', function () {
    });
  });

  describe('setData()', function () {
    it('', function () {
    });
  });
});

