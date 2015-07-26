
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

// TODO  var secret = process.env.DFLOW_SECRET || 'changeme'

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
      Object.keys(data.link).forEach(function (key) {
        var link = data.link[key]

        // Add link to view.
        graph.view.link[key] = link

        // Add pipe.
        graph.pipe[key] = [link.from, link.to]

        if (autosave) save(graph)
      })
    })

    socket.on('addInput', function (data) {
      Object.keys(data.node).forEach(function (key) {
        Object.keys(data.node[key].ins).forEach(function (position) {
          if (typeof graph.view.node[key].ins === 'undefined')
            graph.view.node[key].ins = []

          var inputData = data.node[key].ins[position]

          graph.view.node[key].ins[position] = inputData
        })
      })

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
      Object.keys(data.node).forEach(function (key) {
        var node = data.node[key]

        // Add node to view.
        graph.view.node[key] = node

        // Add task.
        graph.task[key] = node.text
      })

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
    if (autosave) console.log('Option autosave is on')
    console.log('Editing graph ' + graphPath)
  })
}

module.exports = editorServer

