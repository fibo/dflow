
var assert       = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element
var Slot    = dflow.Slot

var slot = new Slot()

describe('Slot', function () {
  describe('Constructor', function () {
    it('requires data arg', function () {
// TODO aggiorna questi test, lo Slot ammette anche la mancanza di dato ora
// però non posso cambiare il tipo di dato, a meno che non sia undefined
      var slot1 = new Slot({data:2})
      assert.ok(slot1 instanceof Slot)

      var slot2 = new Slot({data:'xx'})
      assert.ok(slot2 instanceof Slot)

      var slot3 = new Slot({data:[]})
      assert.ok(slot3 instanceof Slot)

      var slot4 = new Slot({data:{}})
      assert.ok(slot4 instanceof Slot)

      var slot5 = new Slot({data:function () {}})
      assert.ok(slot5 instanceof Slot)

      // TODO ci sono altri tipi di dato in nodejs?
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
      it('is an alias of slotToJSON')
    })

  })
})

