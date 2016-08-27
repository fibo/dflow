const no = require('not-defined')
const path = require('path')
const express = require('express')

const debug = require('debug')('dflow')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.all('/*', (req, res) => {
  res.redirect('/')
})

// Socket.io events.

io.on('connection', (socket) => {
  socket.emit('connection')

  debug('user connected')

  socket.on('disconnect', () => {
    debug('user disconnected')
  })
})

function start (opt) {
  if (no(opt)) opt = {}

  // TODO if (opt.open) open index.html
  // TODO opt.port
  const port = 3000

  http.listen(port, () => {
    debug('Listening on port %d', port)
  })
}

exports.start = start
