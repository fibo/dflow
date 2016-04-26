var emptyGraph = require('engine/emptyGraph.json')
var validate = require('engine/validate')

describe('emptyGraph', function () {
  it('is a valid graph', function () {
    validate(emptyGraph).should.be.ok
  })
})
