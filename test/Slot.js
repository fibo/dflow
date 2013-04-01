
var assert       = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element
var Slot    = dflow.Slot

var slot = new Slot()

describe('Slot', function () {
  describe('Constructor', function () {
    it('requires no arguments', function () {
      var slot = new Slot()
      assert.ok(slot instanceof Slot)
    })
  })

  describe('Inheritance', function () {
    it('is an Element', function () {
      assert.ok(slot instanceof Element)
    })
  })

  describe('Methods', function () {
    describe('getData()', function () {
      it('', function () {
      })
    })

    describe('getName()', function () {
      it('', function () {
      })
    })

    describe('slotToJSON()', function () {
      it('returns slot in JSON format', function () {
        var slot = new Slot({data: 1, name: 'foo'})
        var json = {}
        json.id   = slot.getId()
        json.data = slot.getData()
        json.name = slot.getName()
        assert.deepEqual(slot.slotToJSON(),json)
      })
    })

    describe('toJSON()', function () {
      it('is an alias of slotToJSON', function () {
        assert.ok(slot.toJSON === slot.slotToJSON)
      })
    })
  })
})

