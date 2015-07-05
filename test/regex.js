
var dotOperator = require('../src/regex/dotOperator'),
    should    = require('should')

describe('regex', function () {
  describe('dotOperator.attr', function () {
    it('matches .validJavaScriptVariableName', function () {
      dotOperator.func.test('.foo').should.be.true 
      dotOperator.func.test('.1foo').should.be.false
    })
  })

  describe('dotOperator.func', function () {
    it('matches .validJavaScriptFunctionName()', function () {
      dotOperator.func.test('.foo()').should.be.true 
      dotOperator.func.test('.1foo()').should.be.false
    })
  })
})

