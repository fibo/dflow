
var debug = require('debug')('dflow'),
    fs    = require('fs')

var pkg = require('../../package.json')

var accessorRegex = require('../engine/regex/accessor'),
    commentRegex  = require('../engine/regex/comment'),
    subgraphRegex = require('../engine/regex/subgraph')

var builtinFunctions = require('../engine/functions/builtin'),
    windowFunctions  = require('../engine/functions/window')

var emptyGraph = require('../engine/emptyGraph.json')

var defaultOpt = {
  port: 3000,
  indentJSON: false
}

/**
 * Save graph json file
 */

function saveGraph (graphPath, indentJSON, graph, callback) {
  var indentLevel = 0

  if (indentJSON)
    indentLevel = 2

  var jsonString = JSON.stringify(graph, null, indentLevel)

  fs.writeFile(graphPath, jsonString, 'utf8', function (err) {
    if (err) throw err

    if (typeof callback === 'function')
      callback()
  })
}

function editorServer (graphPath, opt) {
  var graph  = require(graphPath),
      nextId = 0

  // Default options.

  var indentJSON = opt.indentJSON || defaultOpt.indentJSON,
      port       = opt.port       || defaultOpt.port

  /**
   * Id generator.
   */

  function getNextId () {
    var currentId = ++nextId + ''

    // Make next id unique.
    if (graph.task[currentId])
      return getNextId()

    if (graph.pipe[currentId])
      return getNextId()

    return currentId
  }

  var bodyParser = require('body-parser'),
      express    = require('express'),
      ejs        = require('ejs'),
      path       = require('path')

  var app  = express(),
      http = require('http').Server(app),
      io   = require('socket.io')(http)

  var save = saveGraph.bind(null, graphPath, indentJSON)

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  // Public dir.

  var publicDir = express.static(path.join(__dirname, 'public'))

  app.use(publicDir)

  // Routes.

  app.get('/', function (req, res) {
    res.redirect('/edit')
  })

  app.get('/edit', function (req, res) {
    res.render('edit', {graphPath: graphPath, version: pkg.version})
  })

  app.get('/graph', function (req, res) {
    res.json(graph)
  })

  app.get('/run', function (req, res) {
    res.render('run', {graph: JSON.stringify(graph)})
  })

  app.get('/tasklist', function (req, res) {
    var taskList = []

    function addToTaskList (item) {
      taskList.push(item)
    }

    Object.keys(builtinFunctions)
          .forEach(addToTaskList)

    Object.keys(windowFunctions)
          .forEach(addToTaskList)

    res.json(taskList)
  })

  // Socket.IO events.

  io.on('connection', function (socket) {
    debug('a user connected')

    socket.emit('loadGraph', graph)

    /**
     * On addLink event.
     */

    function addLink (data) {
      debug('addLink', data)

      var id = getNextId()

      // Add link to view.
      graph.view.link[id] = data

      // Add pipe.
      var inputPosition = data.to[1],
          sourceId      = data.from[0],
          targetId      = data.to[0]

      graph.pipe[id] = [sourceId, targetId]

      if (inputPosition > 0)
        graph.pipe[id].push(inputPosition)

      data.id = id

      io.emit('addLink', data)

      save(graph)
    }

    socket.on('addLink', addLink)

    /**
     * On addInput event.
     */

    function addInput (data) {
      debug('addInput', data)

      var content = data.content || {},
          id      = data.nodeid,
          position = data.position

      if (typeof graph.view.node[id].ins === 'undefined')
        graph.view.node[id].ins = []

      graph.view.node[id].ins.push(content)

      io.emit('addInput', data)

      save(graph)
    }

    socket.on('addInput', addInput)

    /**
     * On addOutput event.
     */

    function addOutput (data) {
      debug('addOutput', data)

      var content  = data.content || {},
          id       = data.nodeid,
          position = data.position

      if (typeof graph.view.node[id].outs === 'undefined')
        graph.view.node[id].outs = []

      graph.view.node[id].outs.push(content)

      io.emit('addOutput', data)

      save(graph)
    }

    socket.on('addOutput', addOutput)

    /**
     * On addNode event.
     */

    function addNode (data) {
      debug('addNode', data)

      var id       = getNextId(),
          key      = null,
          taskName = data.text

      // Add node to view.
      graph.view.node[id] = data

      if (commentRegex.test(taskName)) {
        // Do not add a task if node is a comment.
        debug('comment', taskName)
      }
      else {
        var i      = null,
            numIns = null

        var isBuiltinFunction = typeof builtinFunctions[taskName] === 'function',
            isWindowFunction = typeof windowFunctions[taskName] === 'function'

        // Add ins if taskName has arguments.
        if (isBuiltinFunction) {
          numIns = builtinFunctions[taskName].length

          if (numIns > 0)
            data.ins = []

          for (i = 0; i < numIns; i++)
            data.ins.push({ name: 'in' + i })
        }

        if (isWindowFunction) {
          numIns = windowFunctions[taskName].length

          if (numIns > 0)
            data.ins = []

          for (i = 0; i < numIns; i++)
            data.ins.push({ name: 'in' + i })
        }
        // TODO Manage also global, and process functions

        // Every node in dflow is a function hence it has an out,
        // i.e. the return value of the function.
        data.outs = [{ name: 'out' }]

        // Add task.
        graph.task[id] = taskName

        // Associate node and task.
        graph.view.node[id].task = id
      }

      // If node is an accessor, create its data entry if it does not exists.
      if (accessorRegex.test(taskName)) {
        key = taskName.substring(1)

        if (typeof graph.data === 'undefined')
          graph.data = {}

        if (typeof graph.data[key] === 'undefined')
          graph.data[key] = null
      }

      // If node is a subgraph, create its func entry if it does not exists.
      if (subgraphRegex.test(taskName)) {
        key = taskName.substring(1)

        if (typeof graph.func === 'undefined')
          graph.func = {}

        if (typeof graph.func[key] === 'undefined')
          graph.func[key] = emptyGraph
      }

      io.emit('addNode', data)

      save(graph)
    }

    socket.on('addNode', addNode)

    /**
     * On delLink event.
     */

    function delLink (data) {
      debug('delLink', data)

      var id = data.linkid

      delete graph.pipe[id]

      delete graph.view.link[id]

      io.emit('delLink', data)

      save(graph)
    }

    socket.on('delLink', delLink)

    /**
     * On delNode event.
     */

    function delNode (data) {
      debug('delNode', data)

      var id = data.nodeid

      var taskName = graph.task[id]
      delete graph.task[id]

      delete graph.view.node[id]

      // If node is an accessor, delete its data entry
      // if there are is view node referencing it.

      function byTaskName (key) {
        return graph.view.node[key].text === taskName
      }

      if (accessorRegex.test(taskName)) {
        var numOfAccessorsReferenced = Object.keys(graph.view.node)
                                             .filter(byTaskName)
                                             .length

        if (numOfAccessorsReferenced === 0)
          delete graph.data[taskName.substr(1)]
          // TODO emit delData, document editor events, no event in engine
      }

      io.emit('delNode', data)

      save(graph)
    }

    socket.on('delNode', delNode)

    /**
     * On moveNode event.
     */

    function moveNode (data) {
      debug('moveNode', data)

      var id = data.nodeid

      var node = data

      // Update view.
      graph.view.node[id].x = node.x
      graph.view.node[id].y = node.y

      // The moveNode event is fired after that node is actually moved client side,
      // so it should be sent back to all clients except the one that emitted it.
      socket.broadcast.emit('moveNode', data)

      save(graph)
    }

    socket.on('moveNode', moveNode)
  })

  // Start server.

  function onListening () {
    debug('Listening on port %d', port)

    if (indentJSON)
      debug('Option indentJSON is on')
    else
      debug('Option indentJSON is off')

    debug('Editing graph %s', graphPath)
  }

  http.listen(port, onListening)
}

module.exports = editorServer

