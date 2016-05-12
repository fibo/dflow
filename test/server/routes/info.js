var express = require('express')
var request = require('supertest')
var routes = require('server/routes')

var info = routes.info
var app = express()

app.get('/info', info)

var pkg = require('../../../package.json')

describe('GET /info', function () {
  it('returns package info', function (done) {
    request(app)
      .get('/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        name: pkg.name,
        version: pkg.version
      }, done)
  })
})
