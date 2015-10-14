
var parents = require('../src/engine/parents'),
    should  = require('should')

var pipe = {
      'a': [ '0', '1' ],
      'b': [ '1', '2' ],
      'c': [ '1', '3' ],
      'd': [ '2', '3' ]
    }

var parentsOf = parents.bind(null, pipe)

describe('parentsOf', function () {
  it('returns parent tasks of task', function () {
    parentsOf('0').should.eql([])

    parentsOf('1').should.eql(['0'])

    parentsOf('2').should.eql(['1'])

    parentsOf('3').should.eql(['1', '2'])
  })

  it('does not count twice', function () {
    pipe = {
      'a': [ '0', '1', 0 ],
      'b': [ '0', '1', 1 ]
    }

    parentsOf('1').should.eql(['0']) // not ['0', '0']
  })
})

