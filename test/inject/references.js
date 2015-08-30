
var injectReferences = require('../../src/inject/references'),
    should           = require('should')

var funcs,
    ref,
    task

describe('injectReferences', function () {
  it('modifies funcs object with references injected', function () {
    funcs = { 'Math.cos': Math.cos }
    task = { '1' : '&Math.cos' }

    injectReferences(funcs, task)

    var fun = funcs['Math.cos']
    ref = funcs['&Math.cos']

    fun.should.be.instanceOf(Function)
    ref.should.be.instanceOf(Function)

    ref().should.be.eql(fun)
    ref()(1.5).should.be.eql(fun(1.5))
  })

  it('injects references to globals', function () {
    funcs = {}
    task = { '1' : '&isFinite' }

    injectReferences(funcs, task)

    ref = funcs['&isFinite']

    ref.should.be.instanceOf(Function)

    ref()(10).should.be.true
  })
})

