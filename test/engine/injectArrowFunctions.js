var injectArrowFunctions = require('engine/inject/arrowFunctions')

describe('injectArrowFunctions', function () {
  it('modifies funcs object by injecting evaluated arrow functions', function () {
    var funcs = {}
    var task = {
      a: 'x => x * 2',
      b: "(str) => ( str + 'bbb' )"
    }

    injectArrowFunctions(funcs, task)

    var a = funcs['x => x * 2']
    var b = funcs[task.b]

    a.should.be.instanceOf(Function)
    a(2).should.be.eql(4)

    b.should.be.instanceOf(Function)
    b('aaa').should.be.eql('aaabbb')
  })
})
