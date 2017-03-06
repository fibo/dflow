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

  it('accepts only data that JSON can serialize', function () {
    var funcs = {}
    var graph = {
      task: {
        a: '@foo'
      },
      data: {}
    }

    injectAccessors(funcs, graph)

    var foo = funcs['@foo']

    // Data that can be serialized by JSON.

    ;(foo(null) === null).should.be.True()

    var a = ['array']
    foo(a).should.deepEqual(a)

    var d = new Date()
    foo(d).should.deepEqual(d)

    var n = 1.2
    foo(n).should.eql(n)

    var o = { ok: 1 }
    foo(o).should.eql(o)

    var s = '€'
    foo(s).should.eql(s)

    // Data that JSON will not serialize.

    var f = function () {}
    ;(JSON.stringify(f) === undefined).should.be.True()
    ;(function () {
      foo(f)
    }).should.throwError(/JSON do not serialize data/)
  })
})
