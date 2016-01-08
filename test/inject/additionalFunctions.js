var injectAdditionalFunctions = require('../../src/engine/inject/additionalFunctions')

describe('injectAdditionalFunctions', function () {
  it('modifies funcs object with additional functions', function () {
    var additionalFunctions = {
      foo: Function.prototype
    }
    var funcs = {
      bar: Function.prototype
    }

    injectAdditionalFunctions(funcs, additionalFunctions)

    funcs.foo.should.be.type('function')
  })
})
