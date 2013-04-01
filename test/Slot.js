
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

    describe('arguments', function () {
      describe('data', function () {
        it('defaults to undefined',function () {
          assert.ok(typeof slot.getData() === 'undefined')
        })
      })
    })
  })

  describe('Inheritance', function () {
    it('is an Element', function () {
      assert.ok(slot instanceof Element)
    })
  })

  describe('Methods', function () {
    describe('getData()', function () {
      it('returns the slot data', function () {
        var data
          , slot

        data = 1
        slot = new Slot({data: data})
        assert.equal(slot.getData(), data)

        data = 'xxx'
        slot = new Slot({data: data})
        assert.equal(slot.getData(), data)
      })
    })

    describe('getType()', function () {
      it('returns the slot data type', function () {
        var data
          , slot

        data = 1
        slot = new Slot({data: data})
        assert.equal(slot.getType(), typeof data)

        data = 'xxx'
        slot = new Slot({data: data})
        assert.equal(slot.getType(), typeof data)
      })
    })

    describe('setData()', function () {
      it('set the slot data', function () {
        var data
          , slot

        data = 1
        slot = new Slot()
        slot.setData(data)
        assert.equal(slot.getData(), data)

        data = 'xxx'
        slot = new Slot()
        slot.setData(data)
        assert.equal(slot.getData(), data)
      })

      it('does not change data type', function() {
        var dataNumber
          , dataString
          , slot

        dataNumber = 1
        dataString = 'xxx'
        slot = new Slot({data: dataNumber})
        slot.setData(dataString)
        assert.equal(slot.getData(), dataNumber)
      })

      it('emits *data* events')
    })

    describe('slotToJSON()', function () {
      it('returns slot in JSON format', function () {
        var data = 1
        var name = 'foo'
        var slot = new Slot({
          data: data,
          name: name
        })
        var json = {}
        json.id   = slot.getId()
        json.data = data
        json.name = name
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

