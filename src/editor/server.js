const fs = require('fs')
const debug = require('debug')('dflow')
const path = require('path')
const zlib = require('zlib')

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
          res.setHeader('Content-Encoding', 'gzip')
          res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'})
          fs.createReadStream(path.join(__dirname, 'index.html'))
            .pipe(zlib.createGzip())
            .pipe(res)
          break

        case '/bundle.js':
          res.setHeader('Content-Encoding', 'gzip')
          res.writeHead(200, {'Content-Type': 'application/javascript'})
          fs.createReadStream(path.join(__dirname, 'public', 'bundle.js'))
            .pipe(zlib.createGzip())
            .pipe(res)
          break

        case '/graph':
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(graph.read())
          break

        case '/style.css':
          res.setHeader('Content-Encoding', 'gzip')
          res.writeHead(200, {'Content-Type': 'text/css; charset=UTF-8'})
          fs.createReadStream(path.join(__dirname, 'public', 'style.css'))
            .pipe(zlib.createGzip())
            .pipe(res)
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
