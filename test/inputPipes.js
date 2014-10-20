
var should = require('should')
var inputPipes = require('../src/inputPipes')

var tasks = [
      { key: '0' },
      { key: '1' },
      { key: '2' },
      { key: '3' }
    ]
  , pipes = [
      { key: 'a', from: { key: '0' }, to: { key: '1' } },
      { key: 'b', from: { key: '1' }, to: { key: '2' } },
      { key: 'c', from: { key: '1' }, to: { key: '3' } },
      { key: 'd', from: { key: '2' }, to: { key: '3' } }
    ]

var inputPipesOf = inputPipes.bind(null, pipes)

describe('inputPipes', function () {
  it('returns input pipes of task', function () {
    inputPipesOf(tasks[0]).should.eql([])

    inputPipesOf(tasks[1]).should.eql([pipes[0]])

    inputPipesOf(tasks[2]).should.eql([pipes[1]])

    inputPipesOf(tasks[3]).should.eql([pipes[2], pipes[3]])
  })
})

