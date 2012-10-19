
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
      //assert.ok(_out instanceof Slot);
    });
  });

  describe('isON()', function () {
    it('', function () {
      var out1 = new Out({data: 1});
      assert.ok(out1.isON());

      var out1 = new Out({data: 1});
      assert.ok(out1.isON());
    });
  });

  describe('isOFF()', function () {
    it('', function () {
      var out1 = new Out();
      assert.ok(out1.isOFF());
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

  describe('setData(<*>)', function () {
    it('accepts number', function () {
      var out1 = new Out();
      out1.setData(1);
      //assert.equal(out1.getData(), 1);
    });

    it('accepts array', function () {
      var out1 = new Out();
      var data = ['a', 'b', 'c'];
      out1.setData(data);
      //assert.deepEqual(out1.getData(), data);
    });
  });
});



