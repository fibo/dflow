
var injectAdditionalFunctions = require('../../src/inject/additionalFunctions'),
    should                    = require('should')

describe('injectAdditionalFunctions', function () {
  it('modifies funcs object with additional functions', function () {
     var additionalFunctions = {
          foo: Function.prototype
        },
        funcs = {
          bar: Function.prototype
        }

    injectAdditionalFunctions(funcs, additionalFunctions)

    funcs.foo.should.be.type('function')
  })
})

