var express = require('express')
var Router = require('./Router')

var info = routes.info

var app = express()
var router = new Router()
router.registerRoutesOn(app)

module.exports = app
