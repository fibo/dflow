
var accessor = require('engine/regex/accessor')
var argument = require('engine/regex/argument')
var comment = require('engine/regex/comment')
var dotOperator = require('engine/regex/dotOperator')
var reference = require('engine/regex/reference')
var subgraph = require('engine/regex/subgraph')

var attrRead = dotOperator.attrRead
var attrWrite = dotOperator.attrWrite
var func = dotOperator.func

describe('regex', function () {
  describe('accessor', function () {
    it('matches @attributeName', function () {
      '@foo'.should.match(accessor)
    })
  })

  describe('argument', function () {
    it('matches arguments[N]', function () {
      'arguments[0]'.should.match(argument)
      'arguments[1]'.should.match(argument)
      'arguments[2]'.should.match(argument)
      'arguments[3]'.should.match(argument)
    })
  })

  describe('dotOperator.attrRead', function () {
    it('matches .validJavaScriptVariableName', function () {
      '.foo'.should.match(attrRead)
      '.$foo'.should.match(attrRead)
      '._foo'.should.match(attrRead)
      '.f$oo'.should.match(attrRead)
      '.f_oo'.should.match(attrRead)
      '.1foo'.should.not.match(attrRead)
    })

    it('does not match other dotOperator regexps', function () {
      '.foo='.should.not.match(attrRead)
      '.foo()'.should.not.match(attrRead)
    })
  })

  describe('dotOperator.attrWrite', function () {
    it('matches .validJavaScriptVariableName=', function () {
      '.foo='.should.match(attrWrite)
      '.$foo='.should.match(attrWrite)
      '._foo='.should.match(attrWrite)
      '.f$oo='.should.match(attrWrite)
      '.f_oo='.should.match(attrWrite)
      '.1foo='.should.not.match(attrWrite)
    })

    it('does not match other dotOperator regexps', function () {
      '.foo'.should.not.match(dotOperator.attrWrite)
      '.foo()'.should.not.match(dotOperator.attrWrite)
    })
  })

  describe('dotOperator.func', function () {
    it('matches .validJavaScriptFunctionName()', function () {
      '.foo()'.should.match(func)
      '.$foo()'.should.match(func)
      '._foo()'.should.match(func)
      '.f$oo()'.should.match(func)
      '.f_oo()'.should.match(func)
      '.1foo()'.should.not.match(func)
    })

    it('does not match other dotOperator regexps', function () {
      '.foo'.should.not.match(func)
      '.foo='.should.not.match(func)
    })
  })

  describe('reference', function () {
    it('matches &functionName', function () {
      '&foo'.should.match(reference)
    })
  })

  describe('subgraph', function () {
    it('matches /functionName', function () {
      '/foo'.should.match(subgraph)
      'notStartingWithSlash'.should.not.match(subgraph)
    })

    it('does not match comments', function () {
      '//comment'.should.not.match(subgraph)
      '// comment'.should.not.match(subgraph)
    })
  })

  describe('comment', function () {
    it('matches //comment', function () {
      '//foo'.should.match(comment)
      '// foo'.should.match(comment)
    })
  })
})
