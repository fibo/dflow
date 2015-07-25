
var defaultOpt = {
  port: 3000
}

function saveGraph (graphPath, graph) {
  // TODO var fs = require(fs)
  // fs writefile graphPath JSON.stringify
  console.log(graph)
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

  var port = opt.port || defaultOpt.port

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

// TODO  var secret = process.env.DFLOW_SECRET || 'changeme'

  var publicDir = express.static(path.join(__dirname, 'public'))

  app.use(publicDir)

  // Routes.

  app.get('/', function (req, res) {
    res.render('index', {graphPath: graphPath})
  })

  app.get('/graph.json', function (req, res) {
      res.json(graph)
  })

  // Socket.IO events.

  io.on('connection', function (socket) {
    console.log('a user connected')

    socket.on('disconnect', function () {
      console.log('user disconnected')
    })

    socket.on('addLink', function (data) {
      Object.keys(data.link).forEach(function (key) {
        var link = data.link[key]

        // Add link to view.
        graph.view.link[key] = link

        // Add pipe.
        graph.pipe[key] = [link.from, link.to]

        save(graph)
      })
    })

    socket.on('addNode', function (data) {
      Object.keys(data.node).forEach(function (key) {
        var node = data.node[key]

        // Add node to view.
        graph.view.node[key] = node

        // Add task.
        graph.task[key] = node.text

        save(graph)
      })
    })

    // TODO socket.on('delLink', function (data) {
    //})

    // TODO socket.on('delNode', function (data) {
    //})

    // TODO socket.on('moveLink', function (data) {
    //})

    // TODO socket.on('moveNode', function (data) {
    //})

  })

  // Start server.

  http.listen(port, function () {
    console.log('Listening on port ' + port)
  })
}

module.exports = editorServer

