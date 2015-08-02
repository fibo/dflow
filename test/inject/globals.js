
var injectGlobals = require('../../src/inject/globals'),
    should        = require('should')

describe('injectGlobals', function () {
  it('modifies funcs object with globals injected', function () {
    var funcs = {},
        task = { '1' : 'setTimeout' }

    injectGlobals(funcs, task)

    funcs.setTimeout.should.be.instanceOf(Function)
  })

  it('walks through taskName using dot operator syntax', function () {
    var funcs = {},
        task = { '1' : 'process.version' }

    injectGlobals(funcs, task)

    funcs['process.version']().should.be.eql(process.version)
  })
})

