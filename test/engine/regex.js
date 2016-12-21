
var accessor = require('engine/regex/accessor')
var argument = require('engine/regex/argument')
var comment = require('engine/regex/comment')
var dotOperator = require('engine/regex/dotOperator')
var reference = require('engine/regex/reference')
var subgraph = require('engine/regex/subgraph')

describe('regex', function () {
  describe('accessor', function () {
    it('matches @attributeName', function () {
      accessor.test('@foo').should.be.true
    })
  })

  describe('argument', function () {
    it('matches arguments[N]', function () {
      argument.test('arguments[0]').should.be.true
      argument.test('arguments[1]').should.be.true
      argument.test('arguments[2]').should.be.true
      argument.test('arguments[3]').should.be.true
    })
  })

  describe('dotOperator.attrRead', function () {
    it('matches .validJavaScriptVariableName', function () {
      dotOperator.attrRead.test('.foo').should.be.true
      dotOperator.attrRead.test('.$foo').should.be.true
      dotOperator.attrRead.test('._foo').should.be.true
      dotOperator.attrRead.test('.f$oo').should.be.true
      dotOperator.attrRead.test('.f_oo').should.be.true
      dotOperator.attrRead.test('.1foo').should.be.false
    })

    it('does not match other dotOperator regexps', function () {
      dotOperator.attrRead.test('.foo=').should.be.false
      dotOperator.attrRead.test('.foo()').should.be.false
    })
  })

  describe('dotOperator.attrWrite', function () {
    it('matches .validJavaScriptVariableName=', function () {
      dotOperator.attrWrite.test('.foo=').should.be.true
      dotOperator.attrWrite.test('.$foo=').should.be.true
      dotOperator.attrWrite.test('._foo=').should.be.true
      dotOperator.attrWrite.test('.f$oo=').should.be.true
      dotOperator.attrWrite.test('.f_oo=').should.be.true
      dotOperator.attrWrite.test('.1foo=').should.be.false
    })

    it('does not match other dotOperator regexps', function () {
      dotOperator.attrWrite.test('.foo').should.be.false
      dotOperator.attrWrite.test('.foo()').should.be.false
    })
  })

  describe('dotOperator.func', function () {
    it('matches .validJavaScriptFunctionName()', function () {
      dotOperator.func.test('.foo()').should.be.true
      dotOperator.func.test('.$foo()').should.be.true
      dotOperator.func.test('._foo()').should.be.true
      dotOperator.func.test('.f$oo()').should.be.true
      dotOperator.func.test('.f_oo()').should.be.true
      dotOperator.func.test('.1foo()').should.be.false
    })

    it('does not match other dotOperator regexps', function () {
      dotOperator.func.test('.foo').should.be.false
      dotOperator.func.test('.foo=').should.be.false
    })
  })

  describe('reference', function () {
    it('matches &functionName', function () {
      reference.test('&foo').should.be.true
    })
  })

  describe('subgraph', function () {
    it('matches /functionName', function () {
      subgraph.test('/foo').should.be.true
      subgraph.test('//comment').should.be.false
      subgraph.test('// comment').should.be.false
      subgraph.test('notStartingWithSlash').should.be.false
    })
  })

  describe('comment', function () {
    it('matches //comment', function () {
      comment.test('//foo').should.be.true
    })
  })
})

