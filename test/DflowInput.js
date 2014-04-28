
var dflow = require('../index')
  , should = require('should')

var DflowInput  = dflow.DflowInput
  , DflowOutput = dflow.DflowOutput
  , DflowSlot   = dflow.DflowSlot

describe('DflowInput', function () {
  describe('Inheritance', function () {
    it('is a DflowSlot', function () {
      var input = new DflowInput()

      input.should.be.instanceOf(DflowSlot)
    })
  })

  describe('Attribute', function () {
    describe('#edge', function () {
      var input = new DflowInput()
    })
  })

  describe('Method', function () {
    describe('#connectTo()', function () {
      var input  = new DflowInput()
        , output = new DflowOutput()

      input.connectTo(output)
    })

    describe('#isConnected()', function () {
      var input  = new DflowInput()
        , output = new DflowOutput()

      it('defaults to false', function () {
        input.isConnected().should.be.false
      })

      it('returns true when input has an edge', function () {
        input.connectTo(output)
        input.isConnected().should.be.true
      })
    })
  })
})

