
var dflow = require('dflow')

dflow.register('Math.min', Math.min)
dflow.register('console.log', console.log)

var graph = {
  tasks: [
    {
      id: 2,
      arg: [''],
      name: 'console.log',
      out: undefined
    },
    {
      id: 1,
      arg: [4, 3],
      name: 'Math.min',
      out: undefined
    }
  ],
  pipes: [
    {
      id: 3,
      sourceId: 1,
      targetId: [2, 0]
    }
  ]
}

dflow.evaluate(graph)

