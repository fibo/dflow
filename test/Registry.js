
var dflow = require('../index')
  , should = require('should')

var Registry = dflow.Registry

var get = Registry.get
  , set = Registry.set

describe('Registry', function () {
  describe('set', function () {
    it('return stored function', function () {
      function bar () { return 'quz' }

      var foo = set('foo', bar)

      foo.should.be.Function
      foo.should.be.eql(bar)
    })

    it('coerces to function', function () {
      var PI = set('PI', Math.PI)

      PI.should.be.Function
      PI().should.be.eql(Math.PI)
    })

    it('can override global', function () {
      var max = set('Math.max', Math.min)

      max.should.not.be.eql(Math.max)
      max.should.be.eql(Math.min)
    })
  })

  describe('get', function () {
    it('retrieve stored functions', function () {
      function bar () { return 'quz' }

      set('foo', bar)

      get('foo').should.be.eql(bar)
    })

    it('can retrieve global functions', function () {
      var min = get('Math.min')

      min.should.be.Function
      min.should.be.eql(Math.min)
    })
  })
})

