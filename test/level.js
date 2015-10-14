
var level  = require('../src/engine/level'),
    should = require('should')

var pipe = {
      'a': [ '0', '1' ],
      'b': [ '1', '2' ],
      'c': [ '1', '3' ],
      'd': [ '2', '3' ]
    }

var cachedLevelOf  = {},
    computeLevelOf = level.bind(null, pipe, cachedLevelOf)

describe('level', function () {
  it('returns level of task', function () {
    computeLevelOf('0').should.eql(0)

    computeLevelOf('1').should.eql(1)

    computeLevelOf('2').should.eql(2)

    computeLevelOf('3').should.eql(3)
  })
})

