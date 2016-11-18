const debug = require('debug')('dflow')
const path = require('path')
const read = require('read-file-utf8')

/**
 * Handle onRequest event for editor server.
 */

const editorServer = (graph) => (req, res) => {
  const method = req.method
  const url = req.url

  debug(`${method} ${url}`)

  switch (method) {
    case 'GET':
      switch (url) {
        case '/':
          res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
          res.end(read(path.join(__dirname, 'index.html')))
          break

        case '/bundle.js':
          res.writeHead(200, {'Content-Type': 'text/javascript'})
          res.end(read(path.join(__dirname, 'public', 'bundle.js')))
          break

        case '/graph':
          res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'})
          res.end(graph.read())
          break

        case '/style.css':
          res.writeHead(200, {'Content-Type': 'text/css; charset=UTF-8'})
          res.end(read(path.join(__dirname, 'public', 'style.css')))
          break

        default: res.end()
      } break

    case 'PUT':
      switch (url) {
        case '/graph':
          var body = ''

          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', (err) => {
            if (err) throw err

            graph.update(body)

            res.end()
          })

          break

        default: res.end()
      } break

    default: res.end()
  }
}

module.exports = editorServer
