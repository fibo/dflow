
/**
 * Module dependencies.
 */

var fs      = require('fs')
  , express = require('express')
  , http    = require('http')
  , path    = require('path')

var app = express()

// Create process.dflow global object.
//require('./index.js');

//var df = process.dflow;

var clientDirPath = path.join(__dirname, 'client')

app.configure(function configureExpress(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  //app.use(app.router)
  app.use(express.static(path.join(__dirname, 'client')))
})

app.configure('development', function configureExpressDevelopment() {
  app.use(express.errorHandler())
})

app.get('/', function getRoot(req, res) {
  fs.readFile(
    path.join(__dirname, 'client', 'index.html'),
    function(err, data) {
      res.send(data)
    }
  )
})

//app.get('/graph/:id', routes.graph);

/**
 * Start Application.
 */

http.createServer(app).listen(app.get('port'))

