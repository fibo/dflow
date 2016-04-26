var injectNumbers = require('engine/inject/numbers')

describe('injectNumbers', function () {
  it('turns a task with a name that looks like a number into a function that returns that number', function () {
    var funcs = {}
    var task = {
      'a': '1',
      'b': '-0.5'
    }

    injectNumbers(funcs, task)

    var a = funcs['1']
    var b = funcs['-0.5']

    a.should.be.instanceOf(Function)
    b.should.be.instanceOf(Function)

    a().should.be.eql(1)
    b().should.be.eql(-0.5)
  })
})
