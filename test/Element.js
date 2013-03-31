
var assert       = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element

var element = new Element()

describe('Element', function () {
  describe('Constructor', function () {
    it('works', function () {
      assert.ok(element instanceof Element)
    })
  })

  describe('Inheritance', function () {
    it('is an EventEmitter', function () {
      assert.ok(element instanceof EventEmitter)
    })
  })


  describe('Methods', function () {
    describe('clone()', function () {
      it('returns a copy of the object', function () {
      })
    })

    describe('getId()', function () {
      it('returns the element id', function () {
        assert.ok(typeof element.getId() === 'number')
      })
    })

    describe('elemntToJSON()', function () {
      it('returns element in JSON format', function () {
        var json = {}
        json.id = element.getId()
        assert.deepEqual(element.toJSON(),json)
      })
    })

    describe('toJSON()', function () {
      it('is an alias of elementToJSON')
    })
  })
})

