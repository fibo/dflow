
function editorServer (graphPath, opt) {
  var graph = require(graphPath)

  var defaultOpt = {
    port: 3000
  }

  var bodyParser = require('body-parser'),
      express    = require('express'),
      ejs        = require('ejs')

  var app  = express(),
      http = require('http').Server(app),
      io   = require('socket.io')(http)

  var port = opt.port || defaultOpt.port

  app.set('views', __dirname)
  app.set('view engine', 'ejs')

//  var secret = process.env.DFLOW_SECRET || 'changeme'

  var publicDir = express.static(process.cwd())

  app.use(publicDir)

  app.get('/', function (req, res){
      res.render('editor', {graphPath: graphPath})
  })

  app.get('/graph.json', function (req, res){
      res.json(graph)
  })

  http.listen(port, function () {
    console.log('Listening on port ' + port)
  })
}

module.exports = editorServer

