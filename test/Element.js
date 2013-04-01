
var assert       = require('assert')
var EventEmitter = require('events').EventEmitter

var dflow = require('../index.js')

var Element = dflow.Element

var element = new Element()

describe('Element', function () {
  describe('Constructor', function () {
    it('requires no argument', function () {
      var element = new Element()
      assert.ok(element instanceof Element)
    })

    describe('arguments', function () {
      describe('name', function () {
        it('defaults to undefined',function () {
          assert.ok(typeof element.getName() === 'undefined')
        })

        it('must be a nonempty string')
      })
    })
  }) 
  describe('Inheritance', function () {
    it('is an EventEmitter', function () {
      assert.ok(element instanceof EventEmitter)
    })
  })

  describe('Methods', function () {
    describe('getId()', function () {
      it('returns the element id', function () {
        assert.ok(typeof element.getId() === 'number')
      })
    })

    describe('getName()', function () {
      it('returns the element name', function () {
        var name = 'foo'
        var element = new Element({name: name})
        assert.equal(element.getName(), name)
      })
    })

    describe('elementToJSON()', function () {
      it('returns element in JSON format', function () {
        var name = 'foo'
        var element = new Element({name: name})
        var json = {}
        json.id = element.getId()
        json.name = name
        assert.deepEqual(element.toJSON(),json)
      })
    })

    describe('toJSON()', function () {
      it('is an alias of elementToJSON', function () {
        assert.ok(element.toJSON === element.elementToJSON)
      })
    })
  })
})

