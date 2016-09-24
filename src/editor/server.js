const no = require('not-defined')
const express = require('express')
const path = require('path')

const debug = require('debug')('dflow')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
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
    debug('editor server is listening on port %d', port)
  })
}

exports.start = start
