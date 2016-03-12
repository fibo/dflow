var debug = require('debug')('dflow')
var path = require('path')
var express = require('express')
// var write = require('write-file-utf8')

var pkg = require('../../package.json')

/*
var accessorRegex = require('../engine/regex/accessor')
var commentRegex = require('../engine/regex/comment')
var subgraphRegex = require('../engine/regex/subgraph')
*/

var builtinFunctions = require('../engine/functions/builtin')
var windowFunctions = require('../engine/functions/window')

var emptyGraph = require('../engine/emptyGraph.json')

/*
var noOutput = ['return', 'console.log', 'console.error']
var oneInput = ['return', 'console.log', 'console.error']
*/

var defaultOpt = {
  indentJSON: false,
  port: 3000,
  runOnEdit: false
}

/**
 * Stringify graph to JSON
 */

function graphToJSON (indentJSON, graph) {
  var indentLevel = 0

  if (indentJSON) {
    indentLevel = 2
  }

  var jsonString = JSON.stringify(graph, null, indentLevel)

  return jsonString
}

/**
 * Save graph json file

function saveGraph (graphPath, indentJSON, graph) {
  if (typeof graphPath === 'undefined') {
    return
  }

  var jsonString = graphToJSON(indentJSON, graph)

  write(graphPath, jsonString)
}
 */

function editorServer (graphPath, opt) {
  var graph = null
  // var nextId = 0

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
   */

  var app = express()
  var http = require('http').Server(app)

//  var save = saveGraph.bind(null, graphPath, indentJSON)

  // Static dirs.

  var bowerComponentsDir = express.static(path.join(__dirname, 'bower_components'))
  app.use(bowerComponentsDir)

  var distDir = express.static(path.join(__dirname, '..', '..', 'dist'))
  app.use(distDir)

  var publicDir = express.static(path.join(__dirname, 'client', 'public'))
  app.use(publicDir)

  // Routes.

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'index.html'))
  })

  app.get('/download', function (req, res) {
    var jsonString = graphToJSON(indentJSON, graph)

    var fileName = 'graph.json'

    if (typeof graphPath === 'undefined') {
      fileName = 'dflowGraph.json'
    } else {
      fileName = path.basename(graphPath)
    }

    res.append('Content-Disposition', 'attachment; filename=' + fileName)

    res.send(jsonString)
    res.end()
  })

  app.get('/graph', function (req, res) {
    res.send(graph)
  })

  app.get('/package', function (req, res) {
    res.json(pkg)
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
      'this',
      'this.graph',
      'this.graph.data',
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
