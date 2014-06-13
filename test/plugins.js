
var dflow        = require('../index')
  , corePlugin   = require('../src/plugin/core')
  , windowPlugin = require('../src/plugin/window')

describe('plugin', function () {
  describe('core', function () {
    it('is always loaded at compile time', function () {
      dflow.plugin.core.should.be.equal(corePlugin)
    })
  })

  describe('window', function () {
    it('is loaded if there is a global window'/*, function () {
      global.window = {}

      var dflow = require('../index')

      dflow.plugin.window.should.be.equal(windowPlugin)
    }*/)
  })
})

