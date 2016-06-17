/*
var request = require('supertest')
var connect = require('connect')

var getInfo = require('../../../src/editor/middleware/getInfo')
var app = connect()

app.use(getInfo.endpoint, getInfo.handler)

var pkg = require('../../../package.json')
*/

describe('GET /info', function () {
  it('returns package info'/*, function (done) {
    request(app)
      .get('/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        name: pkg.name,
        version: pkg.version
      }, done)
  }*/)
})
