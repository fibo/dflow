
var fs = require('fs')

var pkg = require('../../package.json')

var defaultOpt = {
  autosave: true,
  port: 3000
}

function saveGraph (graphPath, graph, callback) {
  var jsonString = JSON.stringify(graph)

  fs.writeFile(graphPath, jsonString, 'utf8', function (err) {
    if (err) throw err

    if (typeof callback === 'function') callback()
  })
}

function editorServer (graphPath, opt) {
  var graph = require(graphPath)

  var nextKey = 0

  function getNextKey () {
    var currentKey = ++nextKey + ''

    // Make next key unique.
    if (graph.task[currentKey])
      return getNextKey()

    if (graph.pipe[currentKey])
      return getNextKey()

    return currentKey
  }

  var save = saveGraph.bind(null, graphPath)

  var bodyParser = require('body-parser'),
      express    = require('express'),
      ejs        = require('ejs'),
      path       = require('path')

  var app  = express(),
      http = require('http').Server(app),
      io   = require('socket.io')(http)

  var autosave = opt.autosave || defaultOpt.autosave,
      port     = opt.port     || defaultOpt.port

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  var publicDir = express.static(path.join(__dirname, 'public'))

  app.use(publicDir)

  // Routes.

  app.get('/', function (req, res) {
    res.render('index', {graphPath: graphPath, version: pkg.version})
  })

  app.get('/graph.json', function (req, res) {
      res.json(graph)
  })

  // Socket.IO events.

  io.on('connection', function (socket) {
    socket.on('addLink', function (data) {
      var key  = getNextKey()

      // Add link to view.
      graph.view.link[key] = data

      // Add pipe.
      graph.pipe[key] = [data.from, data.to]

      if (autosave) save(graph)
    })

    socket.on('addInput', function (data) {
      console.log(data)
      /*
      Object.keys(data.node).forEach(function (key) {
        Object.keys(data.node[key].ins).forEach(function (position) {
          if (typeof graph.view.node[key].ins === 'undefined')
            graph.view.node[key].ins = []

          var inputData = data.node[key].ins[position]

          graph.view.node[key].ins[position] = inputData
        })
      })
      */

      if (autosave) save(graph)
    })

    socket.on('addOutput', function (data) {
      Object.keys(data.node).forEach(function (key) {
        Object.keys(data.node[key].outs).forEach(function (position) {
          if (typeof graph.view.node[key].outs === 'undefined')
            graph.view.node[key].outs = []

          graph.view.node[key].outs[position] = data.node[key].outs[position]
        })
      })

      if (autosave) save(graph)
    })

    socket.on('addNode', function (data) {
      var key  = getNextKey()

      // Add node to view.
      graph.view.node[key] = data

      // Add task.
      graph.task[key] = data.text

      // Associate node and task.
      graph.view.node[key].task = key

      if (autosave) save(graph)
    })

    socket.on('delLink', function (data) {
      data.forEach(function (key) {
        delete graph.link[key]

        delete graph.view.link[key]
      })

      if (autosave) save(graph)
    })

    socket.on('delNode', function (data) {
      data.forEach(function (key) {
        delete graph.node[key]

        delete graph.view.node[key]
      })

      if (autosave) save(graph)
    })

    socket.on('moveNode', function (data) {
      Object.keys(data.node).forEach(function (key) {
        var node = data.node[key]

        // Update view.
        graph.view.node[key].x = node.x
        graph.view.node[key].y = node.y

        if (autosave) save(graph)
      })
    })

  })

  // Start server.

  http.listen(port, function () {
    console.log('Listening on port ' + port)

    if (autosave)
      console.log('Option autosave is on')

    console.log('Editing graph ' + graphPath)
  })
}

module.exports = editorServer

