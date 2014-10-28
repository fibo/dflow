
var should = require('should')
var level = require('../src/level')

var pipe = {
      'a': [ '0', '1' ],
      'b': [ '1', '2' ],
      'c': [ '1', '3' ],
      'd': [ '2', '3' ]
    }

var levelOf = level.bind(null, pipe)

describe('level', function () {
  it('returns level of task', function () {
    levelOf('0').should.eql(0)

    levelOf('1').should.eql(1)

    levelOf('2').should.eql(2)

    levelOf('3').should.eql(3)
  })
})

