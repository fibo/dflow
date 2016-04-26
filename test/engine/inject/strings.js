var injectStrings = require('engine/inject/strings')

describe('injectStrings', function () {
  it('modifies funcs object with strings injected', function () {
    var funcs = {}
    var task = {
      'a': "'string'"
    }

    injectStrings(funcs, task)

    var a = funcs["'string'"]

    a.should.be.instanceOf(Function)

    a().should.be.eql('string')
  })
})
