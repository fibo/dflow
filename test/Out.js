
var assert = require('assert')

var dflow = require('../index.js')

var Out  = dflow.Out
var Slot = dflow.Slot

var o = new Out()

describe('Out', function () {
  describe('Constructor', function () {
    it('works', function () {
      assert.ok(o instanceof Out)
    })
  })

  describe('Inheritance', function () {
    it('is a Slot', function () {
      assert.ok(o instanceof Slot)
    })
  })

  describe('isON()', function () {
    it('defaults to true', function () {
      assert.ok(o.isON())
    })
  })

  describe('isOFF()', function () {
    it('', function () {
    })
  })

  describe('getTargets()', function () {
    it('', function () {
    })
  })

  describe('connectTo()', function () {
    it('', function () {
    })
  })

  describe('toJSON()', function () {
    it('', function () {
    })
  })
})

