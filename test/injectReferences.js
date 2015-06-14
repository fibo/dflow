
var injectReferences = require('../src/injectReferences'),
    should           = require('should')

var funcs = {
      'Math.cos': Math.cos
    },
    task = {
      '1' : '&Math.cos'
    }

describe('injectReferences', function () {
  it('modifies funcs object with references injected', function () {
    injectReferences(funcs, task)

    var fun = funcs['Math.cos']
    var ref = funcs['&Math.cos']

    fun.should.be.instanceOf(Function)
    ref.should.be.instanceOf(Function)

    ref().should.be.eql(fun)
    ref()(1.5).should.be.eql(fun(1.5))
  })
})

