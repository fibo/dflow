var injectGlobals = require('engine/inject/globals')

describe('injectGlobals', function () {
  it('modifies funcs object with globals injected', function () {
    var funcs = {}
    var task = { '1': 'setTimeout' }

    injectGlobals(funcs, task)

    funcs.setTimeout.should.be.instanceOf(Function)
  })

  it('walks through taskName using dot operator syntax', function () {
    var funcs = {}
    var task = { '1': 'process.version' }

    injectGlobals(funcs, task)

    funcs['process.version']().should.be.eql(process.version)
  })

  it('works with global constants', function () {
    var funcs = {}
    var task = { '1': 'Math.E' }

    injectGlobals(funcs, task)

    funcs['Math.E']().should.be.eql(Math.E)
  })
})
