
var fs = require('fs')

var pkg = require('../../package.json')

var defaultOpt = {
  autosave: true,
  port: 3000,
  verbose: false // Silence is gold.
}

/**
 * Save graph json file
 *
 * @api private
 */

function saveGraph (graphPath, graph, callback) {
  var jsonString = JSON.stringify(graph)

  fs.writeFile(graphPath, jsonString, 'utf8', function (err) {
    if (err) throw err

    if (typeof callback === 'function')
      callback()
  })
}

/**
 * Log event to stdout
 *
 * @api private
 */

function logEvent (verbose, eventName, eventData) {
  if (verbose)
    console.dir({event: eventName, data: eventData})
}

function editorServer (graphPath, opt) {
  var graph   = require(graphPath),
      nextKey = 0

  /**
   * Key generator.
   *
   * @api private
   */

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

  // Default options.

  var autosave = opt.autosave || defaultOpt.autosave,
      port     = opt.port     || defaultOpt.port,
      verbose  = opt.verbose  || defaultOpt.verbose

  var log = logEvent.bind(null, verbose)

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  // Public dir.

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

    /**
     * On addLink event.
     *
     * @api private
     */

    function addLink (data) {
      log('addLink', data)

      var key  = getNextKey()

      // Add link to view.
      graph.view.link[key] = data

      // Add pipe.
      graph.pipe[key] = [data.from, data.to]

      if (autosave) save(graph)
    }

    socket.on('addLink', addLink)

    /**
     * On addInput event.
     *
     * @api private
     */

    function addInput (data) {
      log('addInput', data)

      var content  = data.content || {},
          key      = data.nodeKey,
          position = data.position

      if (typeof graph.view.node[key].ins === 'undefined')
        graph.view.node[key].ins = []

      graph.view.node[key].ins.push(content)
      if (autosave) save(graph)
    }

    socket.on('addInput', addInput)

    /**
     * On addOutput event.
     *
     * @api private
     */

    function addOutput (data) {
      log('addOutput', data)

      var content  = data.content || {},
          key      = data.nodeKey,
          position = data.position

      if (typeof graph.view.node[key].outs === 'undefined')
        graph.view.node[key].outs = []

      graph.view.node[key].outs.push(content)

      if (autosave) save(graph)
    }

    socket.on('addOutput', addOutput)

    /**
     * On addNode event.
     *
     * @api private
     */

    function addNode (data) {
      log('addNode', data)

      var key  = getNextKey()

      // Add node to view.
      graph.view.node[key] = data

      // Add task.
      graph.task[key] = data.text

      // Associate node and task.
      graph.view.node[key].task = key

      if (autosave) save(graph)
    }

    socket.on('addNode', addNode)

    /**
     * On delLink event.
     *
     * @api private
     */

    function delLink (data) {
      log('delLink', data)

      var key = data

      delete graph.link[key]

      delete graph.view.link[key]

      if (autosave) save(graph)
    }

    socket.on('delLink', delLink)

    /**
     * On delNode event.
     *
     * @api private
     */

    function delNode (data) {
      log('delNode', data)

      var key = data

      delete graph.node[key]

      delete graph.view.node[key]

      if (autosave) save(graph)
    }

    socket.on('delNode', delNode)

    /**
     * On moveNode event.
     *
     * @api private
     */

    function moveNode (data) {
      log('moveNode', data)

      Object.keys(data.node).forEach(function (key) {
        var node = data.node[key]

        // Update view.
        graph.view.node[key].x = node.x
        graph.view.node[key].y = node.y

        if (autosave) save(graph)
      })
    }

    socket.on('moveNode', moveNode)
  })

  // Start server.

  http.listen(port, function () {
    if (verbose) {
      console.log('Listening on port ' + port)

      if (autosave)
        console.log('Option autosave is on')

      console.log('Editing graph ' + graphPath)
    }
  })
}

module.exports = editorServer

