var inputPipes = require('../src/engine/inputPipes')

var pipe = {
  'a': [ '0', '1' ],
  'b': [ '1', '2' ],
  'c': [ '1', '3' ],
  'd': [ '2', '3' ]
}

var inputPipesOf = inputPipes.bind(null, pipe)

describe('inputPipes', function () {
  it('returns input pipes of task', function () {
    inputPipesOf('0').should.eql([])

    inputPipesOf('1').should.eql([pipe.a])

    inputPipesOf('2').should.eql([pipe.b])

    inputPipesOf('3').should.eql([pipe.c, pipe.d])
  })
})
