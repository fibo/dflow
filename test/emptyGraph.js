
var emptyGraph = require('../src/emptyGraph.json'),
    should     = require('should'),
    validate   = require('../src/validate')

describe('emptyGraph', function () {
  it('is a valid graph', function () {
    validate(emptyGraph).should.be.ok
  })
})

