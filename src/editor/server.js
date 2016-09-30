const no = require('not-defined')
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

function start (opt) {
  if (no(opt)) opt = {}

  // TODO opt.port
  const port = 3000

  http.listen(port, () => {
    debug('editor server is listening on port %d', port)

    if (opt.open) {
      const myIp = internalIp()
      const uri = `http://${myIp}:${port}`

      opn(uri)
    }
  })
}

exports.start = start
