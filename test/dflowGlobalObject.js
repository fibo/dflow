
var assert  = require('assert')
  , Element = require('../index.js').Element
  , Graph   = require('../index.js').Graph
  , pkg     = require('../package.json')

var dflow = process.dflow

describe('dflow global object:', function () {
  it('is global', function () {
  
    //assert.ok(process.dflow === df)
  })

  describe('info', function () {
    var info = dflow.info

    describe('version', function () {
      it('holds the package version number', function () {
        assert.equal(info.version, pkg.version)
      })
    })
  })

  describe('root', function () {
    var root = dflow.root

    it('is a Graph', function () {
      assert.ok(root instanceof Graph)
    })

    it('has id = 0', function () {
      assert.equal(root.getId(), 0)
      assert.ok(dflow.getElementById(0) === root)
    })
  })

  describe('getElementById', function () {
    it('returns element given by id', function () {
      var element = new Element()
      var id = element.getId()
      assert.ok(element === dflow.getElementById(id))
    })
  })
})

