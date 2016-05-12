var express = require('express')
var routes = require('./routes')

var info = routes.info

var app = express()

app.get('/info', info)

module.exports = app
