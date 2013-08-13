
var dflow = require('../index')
var iper = require('iper')

var IperGraph = iper.IperGraph

describe('Global context', function () {
  it('exists', function () {
    dflow.root.should.be.instanceOf(IperGraph)
  })
})

