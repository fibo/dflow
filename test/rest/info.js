var connect = require('connect')
var http = require('http')
var request = require('supertest')

var pkg = require('../../package.json')
var info = require('../../src/rest/info')

describe('info', function () {
  it('returns package info', function (done) {
    var app = connect()

    app.use('/info', info)

    var server = http.createServer(app)

    request(server).get('/info')
                   .set('Accept', 'application/json')
                   .expect(200, {
                     name: pkg.name,
                     version: pkg.version
                   }, done)
  })
})
