
var should = require('should')
var inputArgs = require('../src/inputArgs')

var tasks = [
      { key: '0' },
      { key: '1' },
      { key: '2' },
      { key: '3' }
    ]
  , pipes = [
      { key: 'a', from: '0', to: '1', arg: 0 },
      { key: 'b', from: '1', to: '2', arg: 0 },
      { key: 'c', from: '2', to: '3', arg: 0 },
      { key: 'd', from: '1', to: '3', arg: 1 }
    ]
  , outs = {
    '0': 'foo',
    '1': 'bar',
    '2': 'quz'
  }

var inputArgsOf = inputArgs.bind(null, outs, pipes)

describe('inputArgs', function () {
  it('returns input args of task', function () {
    inputArgsOf('0').should.eql([])

    inputArgsOf('1').should.eql(['foo'])

    inputArgsOf('2').should.eql(['bar'])

    inputArgsOf('3').should.eql(['quz', 'bar'])
  })
})

