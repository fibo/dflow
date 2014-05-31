
var dflow = require('dflow')

// add a custom function
dflow.register('message', function () { console.log('List of registered functions:') })

dflow.evaluate({
  tasks: [
    {
      id: 1,
      name: 'dflow.registered',
      arg: []
    },
    {
       id: 2,
       name: 'console.log',
       arg: []
    },
    {
      id: 3,
      name: 'message',
      arg: []
    }
  ],
  pipes: [{
    id: 4,
    sourceId: 1,
    targetId: [2, 0]
  }]
})

