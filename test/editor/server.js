const http = require('http')
const path = require('path')
const request = require('supertest')
const should = require('should')

const Graph = require('engine/Graph')
const editorServer = require('editor/server')

const graphPath = path.join(__dirname, 'sampleGraph.json')
const graph = new Graph(graphPath)

const app = http.createServer(editorServer(graph))

describe('editor server', () => {
  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect('Content-Encoding', 'gzip')
      .expect(200)
      .end((err, res) => done(err))
  })

  it('GET /bundle.js', (done) => {
    request(app)
      .get('/bundle.js')
      .expect('Content-Type', 'application/javascript')
      .expect('Content-Encoding', 'gzip')
      .expect(200)
      .end((err, res) => done(err))
  })

  it('GET /style.css', (done) => {
    request(app)
      .get('/style.css')
      .expect('Content-Type', 'text/css; charset=UTF-8')
      .expect('Content-Encoding', 'gzip')
      .expect(200)
      .end((err, res) => done(err))
  })

  it('GET /graph', (done) => {
    request(app)
      .get('/graph')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => done(err))
  })

  it('PUT /graph', (done) => {
    const newGraph = {}

    request(app)
      .put('/graph')
      .send(newGraph)
      .expect(200)
      .end((err, res) => {
        should.deepEqual(graph.read(), JSON.stringify(newGraph))
        done(err)
      })
  })
})
