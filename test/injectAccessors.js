
var should = require('should')
var injectAccessors = require('../src/injectAccessors')

var funcs = {}
  , graph = {
      task: {
      '1' : '.foo',
      '2': '.bar'
      },
      data: {
        'foo': 1,
        'bar': [2]
      }
    }
  , data


describe('injectAccessors', function () {
  it('modifies funcs object with accessors injected', function () {
    injectAccessors(funcs, graph)

    var bar = funcs['.bar']
    var foo = funcs['.foo']

    foo.should.be.instanceOf(Function)
    bar.should.be.instanceOf(Function)

    foo().should.be.eql(graph.data.foo)
    bar().should.be.eql(graph.data.bar)

    
    data = { a: [2, 3]}
    foo(data)
    foo().should.be.eql(graph.data.foo)
    foo().should.be.eql(data)
  })
})

