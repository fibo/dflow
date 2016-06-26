var request = require('supertest')
var connect = require('connect')
var path = require('path')

var graph = require('editor/middleware/graph')

var graphPath = path.join(__dirname, '../../../src/examples/graphs/sum.json')

var app = connect()

app.use(graph.handler(graphPath))

describe('GET /graph', () => {
  it('returns graph JSON', (done) => {
    request(app)
      .get('/graph')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, require(graphPath), done)
  })
})
