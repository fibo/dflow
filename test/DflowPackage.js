
var dflow = require('../index')

var DflowPackage = dflow.DflowPackage

var pkg = new DflowPackage('Foo')

describe('DflowPackage', function () {
  describe('Constructor', function () {
    it('has signature `(name)`', function () {
      pkg.should.be.instanceOf(DflowPackage)
    })
  })

  describe('Attributes', function () {
    describe('#name', function () {
      it('is a String', function () {
        pkg.name.should.be.a.String
      })
    })
  })

  describe('Methods', function () {})
})

