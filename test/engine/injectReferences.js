var injectReferences = require('engine/inject/references')

describe('injectReferences', function () {
  it('modifies funcs object with references injected', function () {
    var funcs = { 'Math.cos': Math.cos }
    var task = { '1': '&Math.cos' }

    injectReferences(funcs, task)

    var fun = funcs['Math.cos']
    var ref = funcs['&Math.cos']

    fun.should.be.instanceOf(Function)
    ref.should.be.instanceOf(Function)

    ref().should.be.eql(fun)
    ref()(1.5).should.be.eql(fun(1.5))
  })

  it('injects references to globals', function () {
    var funcs = {}
    var task = { '1': '&isFinite' }

    injectReferences(funcs, task)

    var ref = funcs['&isFinite']

    ref.should.be.instanceOf(Function)

    ref()(10).should.be.True()
  })
})
