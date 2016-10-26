var fun = require('engine/fun')

describe('example package', function () {
  describe('npm-package-template', function () {
    it('is an npm package template', function () {
      var pkg = require('examples/packages/npm-package-template')

      pkg.graph.should.be.an.Object
      pkg.funcs.should.be.an.Object
    })
  })

  describe('npm-package-minimal', function () {
    it('is a dflow graph packaged with npm', function () {
      var graph = require('examples/packages/npm-package-minimal')

      var sum = fun(graph)

      sum(2, 2).should.be.eql(4)
    })
  })
})
