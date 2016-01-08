var emptyGraph = require('../src/engine/emptyGraph.json')
var validate = require('../src/engine/validate')

describe('emptyGraph', function () {
  it('is a valid graph', function () {
    validate(emptyGraph).should.be.ok
  })
})
