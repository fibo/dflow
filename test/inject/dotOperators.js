
var injectDotOperators = require('../../src/inject/dotOperators'),
    should             = require('should')

describe('injectdotOperators', function () {
  it('modifies funcs object with dot operators attribute-like injected', function () {
    var funcs = {},
        graph = {
          task: {
            '1': '.version',
            '2': '.exit'
          }
        }

    injectDotOperators(funcs, graph)

    var getVersion = funcs['.version'],
        exit       = funcs['.exit']

    getVersion.should.be.a.Function
    exit.should.be.a.Function

    getVersion(process).should.be.eql(process.version)

    // This will return a reference to process.exit, it should not call it.
    exit(process).should.be.a.Function
  })

  it('modifies funcs object with dot operators function-like injected', function () {
    var funcs = {},
        graph = {
          task: {
            '1': '.foo()',
            '2': '.sum()'
          }
        }

    injectDotOperators(funcs, graph)

    var foo = funcs['.foo()'],
        sum = funcs['.sum()']

    foo.should.be.a.Function

    var Obj = {
      foo: function () { return 1 },
      sum: function (a) { return a + this.one },
      one: 1
    }

    foo(Obj).should.be.eql(1)
    sum(Obj, 2).should.be.eql(3) // 1 + 2 = 3, executed in Obj context.
  })
})

