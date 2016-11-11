const bodyParser = require('body-parser')
const debug = require('debug')('dflow')
const express = require('express')
const internalIp = require('internal-ip')
const no = require('not-defined')
const opn = require('opn')
const path = require('path')
const read = require('read-file-utf8')
const write = require('write-file-utf8')

const app = express()
const http = require('http').Server(app)

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

var graphPath = null
var graph = null

app.get('/graph', (req, res) => {
  debug('read graph')
  res.json(graph)
})

app.put('/graph', (req, res) => {
  graph = req.body

  debug('update graph')
  // TODO why using a JSON body parser when it is only needed to
  // write the content in a file? Using express could be avoided.
  write(graphPath, JSON.stringify(graph), (err) => {
    if (err) res.status(500).json({ ok: false })
    else res.json({ ok: true })
  })
})

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
