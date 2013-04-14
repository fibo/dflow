
var assert = require('assert')

# TODO rinomina questo file in snippets e aggiungene altri

describe('synopsis:', function () {
    require('../index.js')

    process.dflow.root.pushNode({
      task: function () {
        console.log('hello world')
      }
    })

    process.dflow.root.emit('task')
})

