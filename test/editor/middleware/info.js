var request = require('supertest')
var connect = require('connect')

var info = require('editor/middleware/info')
var app = connect()

app.use(info.handler)

var pkg = require('../../../package.json')

describe('GET /info', () => {
  it('returns package info', (done) => {
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
