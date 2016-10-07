const no = require('not-defined')
const read = require('read-file-utf8')
const express = require('express')
const path = require('path')
const opn = require('opn')
const internalIp = require('internal-ip')
const debug = require('debug')('dflow')

const app = express()
const http = require('http').Server(app)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

var graphPath = null
var graph = null

app.get('/graph', (req, res) => {
  res.json(graph)
})

// TODO install body-parser and write graph to file
// app.post('/graph', (req, res) => {
//   here graphPath should not be null
// })

function start (opt) {
  if (no(opt)) opt = {}

  // TODO opt.port
  const port = 3000

  // Read JSON graph.
  graphPath = opt.graphPath
  graph = JSON.parse(read(graphPath))

  http.listen(port, () => {
    const myIp = internalIp()
    const uri = `http://${myIp}:${port}`

    debug(`editor server is listening on ${uri}`)

    if (opt.open) opn(uri)
  })
}

exports.start = start
