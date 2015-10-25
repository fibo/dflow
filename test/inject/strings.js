
var injectStrings = require('../../src/engine/inject/strings'),
    should        = require('should')

describe('injectStrings', function () {
  it('modifies funcs object with strings injected', function () {
    var funcs = {}
      , task = {
          'a' : "'string'"
      }

    injectStrings(funcs, task)

    var a = funcs["'string'"]

    a.should.be.instanceOf(Function)

    a().should.be.eql('string')
  })
})

