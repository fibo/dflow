
var accessor = require('../src/engine/regex/accessor')
var argument = require('../src/engine/regex/argument')
var comment = require('../src/engine/regex/comment')
var dotOperator = require('../src/engine/regex/dotOperator')
var reference = require('../src/engine/regex/reference')
var subgraph = require('../src/engine/regex/subgraph')

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

  describe('reference', function () {
    it('matches &functionName', function () {
      reference.test('&foo').should.be.true
    })
  })

  describe('subgraph', function () {
    it('matches /functionName', function () {
      subgraph.test('/foo').should.be.true
      subgraph.test('//comment').should.be.false
      subgraph.test('notStartingWithSlash').should.be.false
    })
  })

  describe('comment', function () {
    it('matches //comment', function () {
      comment.test('//foo').should.be.true
    })
  })
})

