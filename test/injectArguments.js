

var should = require('should')
var injectArguments = require('../src/injectArguments')

var funcs = {}
  , task = {
      '1' : 'arguments',
      '2': 'arguments[0]',
      '3': 'arguments[1]'
  }


describe('injectArguments', function () {
  it('returns funcs object with arguments[N] injected', function () {
    ;(function () {
      funcs = injectArguments(funcs, task, arguments)

      funcs['arguments[0]'].should.be.instanceOf(Function)
      funcs['arguments[1]'].should.be.instanceOf(Function)

      funcs['arguments[0]']().should.be.eql('foo')
      funcs['arguments[1]']().should.be.eql('bar')
    })('foo', 'bar', 'quz')
  })

  it('returns funcs object with arguments injected', function () {
    ;(function () {
      funcs = injectArguments(funcs, task, arguments)

      funcs['arguments'].should.be.instanceOf(Function)

      funcs['arguments']().should.be.eql(arguments)
    })('foo', 'bar', 'quz')
  })
})

