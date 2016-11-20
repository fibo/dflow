const http = require('http')
const path = require('path')
const request = require('supertest')
const should = require('should')

const Graph = require('engine/Graph')
const editorServer = require('editor/server')

const graphPath = path.join(__dirname, 'sampleGraph.json')
const graph = new Graph(graphPath)

const app = http.createServer(editorServer(graph))

const resource = (path) => ({
  hasContentType: (contentType) => {
    it(`is ${contentType}`, (done) => {
      request(app)
        .get(path)
        .expect('Content-Type', contentType)
        .expect(200)
        .end((err, res) => done(err))
    })
  }
})

describe('editor server', () => {
  describe('GET /', () => {
    resource('/').hasContentType('text/html; charset=UTF-8')
  })

  describe('GET /bundle.js', () => {
    resource('/bundle.js').hasContentType('text/javascript')
  })

  describe('GET /style.css', () => {
    resource('/style.css').hasContentType('text/css; charset=UTF-8')
  })

  describe('GET /graph', () => {
    resource('/graph').hasContentType('application/json; charset=UTF-8')
  })

  describe('PUT /graph', () => {
    it('updates graph', (done) => {
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
})
