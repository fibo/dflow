
var algorithm = require('../src/algorithm')
  , dflow     = require('../index')
  , myplugin  = require('../examples/myplugin')
  , should    = require('should')
  , _         = require('underscore')

describe('dflow', function () {
  for (var i in algorithm) {
    describe(i, function () {
      it('is imported from algorithm.js', function () {
        dflow[i].should.be.eql(algorithm[i])
      })
    })
  }

  describe('pluginFrom', function () {
    var underscorePlugin = dflow.pluginFrom(_, '_')

    it('convert a foreign package to a dflow plugin', function () {
      dflow.use(underscorePlugin)

      var version = dflow.Registry.get('_.VERSION')
      version().should.eql(_.VERSION)

      for (var i in _)
        if (typeof _[i] === 'function')
          dflow.Registry.get('_.' + i).should.eql(_[i])
    })
  })

  describe('use', function () {
    dflow.use(myplugin)

    it('imports tasks', function () {
      dflow.Registry.get('mytask').should.be.Function
    })

    it('updates dflow.plugin', function () {
      dflow.plugin.myplugin.should.eql(myplugin)
    })
  })
})
