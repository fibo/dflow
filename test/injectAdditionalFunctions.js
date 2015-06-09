
var injectAdditionalFunctions = require('../src/injectAdditionalFunctions'),
    should                    = require('should')

describe('injectAdditionalFunctions', function () {
  it('modifies funcs object with additional functions'/*, function () {
    var funcs               = {
          foo: Function.prototype
        },
        additionalFunctions = {}

    injectAdditionalFunctions(funcs, additionalFunctions)

    (typeof funcs.foo).should.be.eql('function')
  }*/)

  it('throws if a builtin function is overridden')
})

