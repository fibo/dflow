
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

var dflow = require('../index.js');

var Element = dflow.Element;

describe('Element', function () {
  describe('constructor:', function () {
    it('works', function () {
      var element = new Element();
      assert.ok(element instanceof Element);
    });
  });

  describe('inheritance:', function () {
    it('is an EventEmitter', function () {
      var element = new Element();
      assert.ok(element instanceof EventEmitter);
    });
  });

  describe('getId', function () {
    it('returns the element id', function () {
      var element = new Element();
      assert.ok(typeof element.getId() == 'number');
    });
  });
});

