var evalTasks = require('engine/evalTasks')

describe('evalTasks', function () {
  it('injects arrow functions', function () {
    var funcs = {}
    var task = {
      a: 'x => x * 2',
      b: "(str) => ( str + 'bbb' )"
    }

    evalTasks(funcs, task)

    var a = funcs['x => x * 2']
    var b = funcs[task.b]

    a.should.be.instanceOf(Function)
    a(2).should.be.eql(4)

    b.should.be.instanceOf(Function)
    b('aaa').should.be.eql('aaabbb')
  })

  it('injects `new Date`', function () {
    var funcs = {}
    var task = {
      now: 'new Date'
    }

    evalTasks(funcs, task)

    var now = funcs[task.now]

    now.should.be.instanceOf(Function)

    now().should.be.instanceOf(Date)
  })
})
