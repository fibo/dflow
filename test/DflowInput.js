
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
    describe('#isConnected()', function () {
      var input = new DflowInput()
    })
  })
})

