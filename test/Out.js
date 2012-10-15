
var assert = require('assert');

var dflow = require('../index.js');

var Out = dflow.Out;
var Slot = dflow.Slot;

describe('Out', function () {
  describe('constructor:', function () {
    it('', function () {
    });
  });

  describe('inheritance:', function () {
    it('is a Slot', function () {
      var _out = new Out({data:0});
      assert.ok(_out instanceof Slot);
    });
  });

  describe('getTargets()', function () {
    it('', function () {
    });
  });

  describe('connectTo(<In>)', function () {
    it('', function () {
    });
  });
});



