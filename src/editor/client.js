
var request = new XMLHttpRequest(),
    socket = io()

var Canvas = require('flow-view').Canvas
var canvas = new Canvas('flow')

var events = ['addLink' , 'addNode',
              'addInput', 'addOutput',
              'delLink' , 'delNode'  , 'moveNode']

events.forEach(function (eventName) {
  canvas.broker.removeAllListeners(eventName)

  canvas.broker.on(eventName, function (ev) {
    console.log(eventName, ev)
    socket.emit(eventName, ev)
  })

socket.on(eventName, function (data) {
  console.log(eventName, data)
  canvas[eventName](data)
})

})

socket.on('loadGraph', function (graph) {
  console.log('loadGraph', graph)
  canvas.render(graph.view)
})

/*
socket.on('addNode', function (data) {
  console.log(data)
  canvas.addNode(data)
})

socket.on('addLink', function (data) {
  console.log(data)
  canvas.addLink(data)
})

socket.on('addInput', function (data) {

  console.log(data)
  canvas.addInput(data)
})

*/
