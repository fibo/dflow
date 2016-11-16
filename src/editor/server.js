const debug = require('debug')('dflow')
const http = require('http')
const internalIp = require('internal-ip')
const no = require('not-defined')
const opn = require('opn')
const path = require('path')
const read = require('read-file-utf8')
// const write = require('write-file-utf8')

var graphPath = null
var graph = null

/*
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

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

*/

const server = http.createServer((req, res) => {
  const method = req.method
  const url = req.url

  debug(`${method} ${url}`)

  switch (method) {
    case 'GET':
      switch (url) {
        case '/':
          res.writeHead(200, {'Content-Type': 'text/html'})
          res.end(read(path.join(__dirname, 'index.html')))
          break

        case '/bundle.js':
          res.writeHead(200, {'Content-Type': 'text/javascript'})
          res.end(read(path.join(__dirname, 'public', 'bundle.js')))
          break

        case '/style.css':
          res.writeHead(200, {'Content-Type': 'text/css'})
          res.end(read(path.join(__dirname, 'public', 'style.css')))
          break

        default: res.end()
      } break

    case 'PUT':
      switch (url) {
        case '/graph':
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(read(graphPath))
          break

        default: res.end()
      } break

    default: res.end()
  }
})

function start (opt) {
  if (no(opt)) opt = {}

  // TODO opt.port
  const port = 3000

  // Read JSON graph.
  graphPath = opt.graphPath
  graph = JSON.parse(read(graphPath))

  server.listen(port, () => {
    const myIp = internalIp()
    const uri = `http://${myIp}:${port}`

    debug(`editor server is listening on ${uri}`)

    if (opt.open) opn(uri)
  })
}

exports.start = start
