var debug = require('debug')('dflow')
var write = require('write-file-utf8')

var pkg = require('../../package.json')

var accessorRegex = require('../engine/regex/accessor')
var commentRegex = require('../engine/regex/comment')
var subgraphRegex = require('../engine/regex/subgraph')

var builtinFunctions = require('../engine/functions/builtin')
var windowFunctions = require('../engine/functions/window')

var emptyGraph = require('../engine/emptyGraph.json')

var noOutput = ['return', 'console.log', 'console.error']
var oneInput = ['return', 'console.log', 'console.error']

var defaultOpt = {
  indentJSON: false,
  port: 3000,
  runOnEdit: false
}

/**
 * Save graph json file
 */

function saveGraph (graphPath, indentJSON, graph) {
  if (typeof graphPath === 'undefined') {
    return
  }

  var indentLevel = 0

  if (indentJSON) {
    indentLevel = 2
  }

  var jsonString = JSON.stringify(graph, null, indentLevel)

  write(graphPath, jsonString)
}

function editorServer (graphPath, opt) {
  var graph = null
  var nextId = 0

  if (typeof graphPath === 'undefined') {
    graph = Object.assign({}, emptyGraph)
  } else {
    graph = require(graphPath)
  }

  // Environment overrides defaults.

  var envPORT = process.env.PORT
  var envRUN_ON_EDIT = process.env.RUN_ON_EDIT

  if (typeof envPORT !== 'undefined') {
    defaultOpt.port = envPORT
  }

  if (typeof envRUN_ON_EDIT !== 'undefined') {
    defaultOpt.runOnEdit = envRUN_ON_EDIT
  }

  // Default options.

  var indentJSON = opt.indentJSON || defaultOpt.indentJSON
  var port = opt.port || defaultOpt.port

  /**
   * Id generator.
   */

  function getNextId () {
    var currentId = ++nextId + ''

    // Make next id unique.
    if (graph.task[currentId]) {
      return getNextId()
    }

    if (graph.pipe[currentId]) {
      return getNextId()
    }

    return currentId
  }

  var express = require('express')
  var path = require('path')

  var app = express()
  var http = require('http').Server(app)
  var io = require('socket.io')(http)

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
    if (typeof graphPath === 'undefined') {
      res.render('edit', {graphPath: '(in memory)', version: pkg.version})
    } else {
      res.render('edit', {graphPath: graphPath, version: pkg.version})
    }
  })

  app.get('/graph', function (req, res) {
    res.json(graph)
  })

  app.get('/run', function (req, res) {
    res.render('run', {graph: JSON.stringify(graph)})
  })

  app.get('/tasklist', function (req, res) {
    var taskList = [
      'arguments',
      'arguments[0]',
      'arguments[1]',
      'arguments[2]',
      'return'
    ]

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
      var inputPosition = data.to[1]
      var sourceId = data.from[0]
      var targetId = data.to[0]

      graph.pipe[id] = [sourceId, targetId]

      if (inputPosition > 0) {
        graph.pipe[id].push(inputPosition)
      }

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

      var content = data.content || {}
      var id = data.nodeid

      if (typeof graph.view.node[id].ins === 'undefined') {
        graph.view.node[id].ins = []
      }

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

      var content = data.content || {}
      var id = data.nodeid

      if (typeof graph.view.node[id].outs === 'undefined') {
        graph.view.node[id].outs = []
      }

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

      var id = getNextId()
      var key = null
      var taskName = data.text

      if (commentRegex.test(taskName)) {
        // Do not add a task if node is a comment.
        debug('comment', taskName)
      } else {
        var i = null
        var numIns = null

        var isBuiltinFunction = typeof builtinFunctions[taskName] === 'function'
        var isWindowFunction = typeof windowFunctions[taskName] === 'function'

        // Add ins if taskName has arguments.
        if (isBuiltinFunction) {
          numIns = builtinFunctions[taskName].length

          if (numIns > 0) {
            data.ins = []
          }

          for (i = 0; i < numIns; i++) {
            data.ins.push({ name: 'in' + i })
          }
        }

        if (isWindowFunction) {
          numIns = windowFunctions[taskName].length

          if (numIns > 0) {
            data.ins = []
          }

          for (i = 0; i < numIns; i++) {
            data.ins.push({ name: 'in' + i })
          }
        }

        if (oneInput.indexOf(taskName) > -1) {
          data.ins = [{ name: 'in' }]
        }

        // Every node in dflow is a function hence it has an out,
        // i.e. the return value of the function.
        // Few tasks has no output, i.e. console.log, return, etc.
        if (noOutput.indexOf(taskName) === -1) {
          data.outs = [{ name: 'out' }]
        }
      }

      // If node is an accessor,
      // create its data entry if it does not exists.
      if (accessorRegex.test(taskName)) {
        key = taskName.substring(1)

        if (typeof graph.data === 'undefined') {
          graph.data = {}
        }

        if (typeof graph.data[key] === 'undefined') {
          graph.data[key] = null
        }
      }

      // If node is a subgraph,
      // create its func entry if it does not exists.
      if (subgraphRegex.test(taskName)) {
        key = taskName.substring(1)

        if (typeof graph.func === 'undefined') {
          graph.func = {}
        }

        if (typeof graph.func[key] === 'undefined') {
          graph.func[key] = Object.assign({}, emptyGraph)
        }
      }

      // Add task.
      graph.task[id] = taskName

      // Add node to view.
      graph.view.node[id] = data

      // Associate node and task.
      graph.view.node[id].task = id

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

        if (numOfAccessorsReferenced === 0) {
          delete graph.data[taskName.substr(1)]
          // TODO emit delData, document editor events, no event in engine
        }
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

    if (indentJSON) {
      debug('Option indentJSON is on')
    } else {
      debug('Option indentJSON is off')
    }

    if (typeof graph === 'undefined') {
      debug('Editing graph in memory')
    } else {
      debug('Editing graph %s', graphPath)
    }
  }

  http.listen(port, onListening)
}

module.exports = editorServer
