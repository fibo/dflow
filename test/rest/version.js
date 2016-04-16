var connect = require('connect')
var dflow = require('dflow')
var http = require('http')
var request = require('supertest')

var pkg = require('../../package.json')
// TODO var version = dflow.rest.version
var version = require('../../src/rest/version')

describe('version', () => {
  it('returns package version', (done) => {
    var app = connect()

    app.use('/version', version)

    var server = http.createServer(app)

    request(server).get('/version').expect(200, pkg.version, done)
  })
})
