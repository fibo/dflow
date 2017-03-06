var injectDotOperators = require('engine/inject/dotOperators')

describe('injectDotOperators', function () {
  it('modifies funcs object with dot operators attribute readers injected', function () {
    // This test works server side if Nodejs process global is used
    // but it will fail client side, so using a fake process is better.
    var procezz = {
      version: 1,
      exit: function () {
        throw new Error('kernel panic')
      }
    }

    var funcs = {}
    var graph = {
      task: {
        '1': '.version',
        '2': '.exit'
      }
    }

    injectDotOperators(funcs, graph.task)

    var getVersion = funcs['.version']
    var exit = funcs['.exit']

    getVersion.should.be.a.Function()
    exit.should.be.a.Function()

    getVersion(procezz).should.be.eql(procezz.version)

    // This will return a reference to procezz.exit, it should not call it.
    exit(procezz).should.be.a.Function()
  })

  it('modifies funcs object with dot operators attribute writers injected', function () {
    var funcs = {}
    var graph = {
      task: {
        '1': '.foo='
      }
    }

    injectDotOperators(funcs, graph.task)

    var setFoo = funcs['.foo=']

    setFoo.should.be.a.Function()

    var obj = {}
    var obj2 = setFoo(obj, 'bar')

    obj.foo.should.be.eql('bar')
    obj2.foo.should.be.eql('bar')
  })

  it('modifies funcs object with dot operators function-like injected', function () {
    var funcs = {}
    var graph = {
      task: {
        '1': '.foo()',
        '2': '.sum()'
      }
    }

    injectDotOperators(funcs, graph.task)

    var foo = funcs['.foo()']
    var sum = funcs['.sum()']

    foo.should.be.a.Function()

    var Obj = {
      foo: function () { return 1 },
      sum: function (a) { return a + this.one },
      one: 1
    }

    foo(Obj).should.be.eql(1)
    sum(Obj, 2).should.be.eql(3) // 1 + 2 = 3, executed in Obj context.
  })
})
