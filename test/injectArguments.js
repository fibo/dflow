

var should = require('should')
var injectArguments = require('../src/injectArguments')

var funcs = {}
  , tasks = [
    { func: 'arguments[0]' },
    { func: 'arguments[1]' }
  ]


describe('injectArguments', function () {
  it('returns funcs object with arguments[N] injected', function () {
    ;(function () {
      funcs = injectArguments(funcs, tasks, arguments)

      funcs['arguments[0]'].should.be.instanceOf(Function)
      funcs['arguments[1]'].should.be.instanceOf(Function)

      funcs['arguments[0]']().should.be.eql('foo')
      funcs['arguments[1]']().should.be.eql('bar')
    })('foo', 'bar', 'quz')
  })
})

