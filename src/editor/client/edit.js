
var debug = require('debug')
var fs            = require('fs')
var insertCss     = require('insert-css')
var regexAccessor = require('../../engine/regex/accessor')

var socket = io()

var cssPaths = [
  '/../../../node_modules/normalize.css/normalize.css',
  '/style.css'
]

function readAndInsertCSS (cssPath) {
  insertCss(fs.readFileSync(__dirname + '/style.css'))
}

cssPaths.forEach(readAndInsertCSS)

var graph = null

window.myDebug = debug
window.onload  = initPage

function initPage () {
  // Debug setup.
  window.myDebug.enable('dflow')
  var debug = window.myDebug('dflow')
  // TODO add Debug toogle button

  // Initialize canvas and other elements.
  var Canvas = require('flow-view').Canvas

  var canvas = new Canvas('graph', {
    nodeSelector: {
      dataList: {
        URL: '/tasklist'
      }
    }
  })

  var taskDataInitButton = document.getElementById('task-data-initialize')
  var taskDataElement = document.getElementById('task-data')
  var taskDataResetButton = document.getElementById('task-data-reset')
  var taskDataTypeSelect = document.getElementById('task-data-type')
  var taskIdElement = document.getElementById('task-id')
  var taskNameElement = document.getElementById('task-name')

  var canvasMethods = ['addLink' , 'addNode',
                       'delLink' , 'delNode']

  canvasMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (data) {
      debug(methodName, data)
      socket.emit(methodName, data)
    })

    socket.on(methodName, function (data) {
      canvas[methodName](data)
    })
  })

  var nodeMethods = ['addInput', 'addOutput']

  nodeMethods.forEach(function (methodName) {
    canvas.broker.removeAllListeners(methodName)

    canvas.broker.on(methodName, function (data) {
      debug(methodName, data)
      socket.emit(methodName, data)
    })

    socket.on(methodName, function (data) {
      var id       = data.nodeid,
          position = data.position

      var node = canvas.node[id]

      node[methodName](position)
    })
  })

  canvas.broker.on('moveNode', function (data) {
    debug('moveNode', data)
    socket.emit('moveNode', data)
  })

  canvas.broker.on('selectNode', function (data) {
    debug('selectNode', data)

    var id = data.nodeid

    var node = canvas.node[id]

    var nodeJSON = node.toJSON()

    var taskName = nodeJSON.text

    taskNameElement.innerHTML = taskName
    taskIdElement.innerHTML   = id

    var taskIsAccessor  = regexAccessor.test(taskName),
        taskDataContent = null,
        taskDataProp    = null,
        taskDataType    = null

    // Show task-data element if task is an accessor.
    if (taskIsAccessor)
      taskDataElement.style.display = 'block'
    else
      taskDataElement.style.display = 'none'

    function resetData () {
      console.log('reset '+taskDataProp)
      graph.data[taskDataProp] = null
      // TODO emit dataChange event
    }

    if (taskIsAccessor) {
      taskDataProp    = taskName.substr(1)
      taskDataContent = graph.data[taskDataProp]

      if (taskDataContent) {
        taskDataType = typeof taskDataContent

        // Show reset button if task data has content.
        taskDataInitButton.style.display  = 'none'
        taskDataTypeSelect.style.display  = 'none'
        taskDataResetButton.style.display = 'block'

        taskDataResetButton.onclick = resetData
      }
      else {
        // Show initialization form if task data is empty.
        taskDataInitButton.style.display  = 'block'
        taskDataTypeSelect.style.display  = 'block'
        taskDataResetButton.style.display = 'none'
      }
    }
  })

  socket.on('moveNode', function (data) {
    debug('moveNode', data)

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

  socket.on('loadGraph', function (data) {
    debug('loadGraph', data)

    graph = data
    canvas.deleteView()
    canvas.render(graph.view)
  })
}

