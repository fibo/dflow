
var dflow = require('dflow')

function string (input) {
  if (typeof input === 'string')
    return input
  else
    return ''
}

dflow.register('string', function string (x) { return x })

var graph = {
  tasks: [
    {
      id: 7,
      arg: ['hello'],
      name: 'string',
      out: undefined
    },
    {
      id: 4,
      arg: [4, 5],
      name: 'Math.max',
      out: undefined
    },
    {
      id: 2,
      arg: [4, 3],
      name: 'Math.min',
      out: undefined
    },
    {
      id: 1,
      arg: ['ciao'],
      name: 'console.log',
      out: undefined
    }
  ],
  pipes: [
    {
      id: 8,
      sourceId: 7,
      targetId: [1, 2]
    },
    {
      id: 3,
      sourceId: 2,
      targetId: [1, 1]
    },
    {
      id: 5,
      sourceId: 4,
      targetId: [1, 0]
    }
  ]
}

dflow.evaluate(graph)

