
var assert = require('assert');

var dflow = require('../index.js');

var In = dflow.In;
var Slot = dflow.Slot;

describe('In', function () {
  describe('constructor:', function () {
    it('requires name and data', function () {
      //var _in = new In({name:'foo',data:'bar'});
    });

    it('throws Error if no name and or no data is passed', function () {
      var newIn1 = function () { new In(); }
      //assert.throws(newIn1, Error);
      //var _in = new In({data:0,name:'xx'});console.log(_in.toJSON());

      var newIn2 = function () { new In({}); }
      //assert.throws(newIn2, Error);

      var newIn3 = function () { new In({data:'bar'}); }
      //assert.throws(newIn3, Error);

      var newIn4 = function () { new In({name:'foo'}); }
      //assert.throws(newIn4, Error);
    });
  });

  describe('inheritance:', function () {
    it('is a Slot', function () {
      //var _in = new In({name:'in1',data:0});
      //assert.ok(_in instanceof Slot);
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

  describe('toJSON()', function () {
    it('', function () {
    });
  });
});

