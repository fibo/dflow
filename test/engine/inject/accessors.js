var injectAccessors = require('engine/inject/accessors')
var should = require('should')

describe('injectAccessors', function () {
  it('modifies funcs object with accessors injected', function () {
    var funcs = {}
    var graph = {
      task: {
        a: '@foo',
        b: '@bar'
      },
      data: {
        foo: 1,
        bar: [2]
      }
    }

    injectAccessors(funcs, graph)

    var bar = funcs['@bar']
    var foo = funcs['@foo']

    foo.should.be.instanceOf(Function)
    bar.should.be.instanceOf(Function)

    foo().should.be.eql(graph.data.foo)
    bar().should.be.eql(graph.data.bar)

    var data = { a: [2, 3] }
    foo(data)
    foo().should.be.eql(graph.data.foo)
    foo().should.be.eql(data)
  })

  it('injects accessor this.graph.data', function () {
    var funcs = {}
    var graph = {
      task: {
        a: 'data'
      },
      data: {
        foo: 1,
        bar: [2]
      }
    }

    injectAccessors(funcs, graph)

    var data = funcs['this.graph.data']

    should.deepEqual(data(), graph.data)

    graph.data.quz = false
    should.deepEqual(data(), {
      foo: 1,
      bar: [2],
      quz: false
    })
  })
})
