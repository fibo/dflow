
var fs = require('fs')
var insertCss = require('insert-css')
var socket = io()

var normalize = fs.readFileSync(__dirname + '/../../../node_modules/normalize.css/normalize.css')
insertCss(normalize)

var style = fs.readFileSync(__dirname + '/style.css')
insertCss(style)

window.onload = function () {
  var Canvas = require('flow-view').Canvas
  var canvas = new Canvas('dflow-graph')

  var canvasMethods = ['addLink' , 'addNode',
                       'delLink' , 'delNode']

  canvasMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (ev) {
      socket.emit(methodName, ev)
    })

    socket.on(methodName, function (data) {
      canvas[methodName](data)
    })
  })

  var nodeMethods = ['addInput', 'addOutput']

  nodeMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (ev) {
      socket.emit(methodName, ev)
    })

    socket.on(methodName, function (data) {
      var id       = data.nodeid,
          position = data.position

      var node = canvas.node[id]

      node[methodName](position)
    })
  })

  canvas.broker.on('moveNode', function (ev) {
    socket.emit('moveNode', ev)
  })

  socket.on('moveNode', function (data) {
    var x  = data.x
        y  = data.y

    var node = canvas.node[data.nodeid]

    node.group.move(x, y)

    node.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (id) {
        var link = output.link[id]

        if (link)
          link.linePlot()
      })
    })

    node.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  })

  socket.on('loadGraph', function (graph) {
    canvas.deleteView()
    canvas.render(graph.view)
  })
}

