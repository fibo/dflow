
var should = require('should')
var inputPipes = require('../src/inputPipes')

var pipes = [
      { key: 'a', from: '0', to: '1' },
      { key: 'b', from: '1', to: '2' },
      { key: 'c', from: '1', to: '3' },
      { key: 'd', from: '2', to: '3' }
    ]

var inputPipesOf = inputPipes.bind(null, pipes)

describe('inputPipes', function () {
  it('returns input pipes of task', function () {
    inputPipesOf('0').should.eql([])

    inputPipesOf('1').should.eql([pipes[0]])

    inputPipesOf('2').should.eql([pipes[1]])

    inputPipesOf('3').should.eql([pipes[2], pipes[3]])
  })
})

