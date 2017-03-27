import React, { PropTypes, Component } from 'react'

const examples = [
  {
    name: 'Hello World',
    json: require('../../../examples/graphs/hello-world.json')
  }, {
    name: 'Sum',
    json: require('../../../examples/graphs/sum.json')
  }, {
    name: 'Load JS',
    json: require('../../../examples/graphs/loadScriptJS.json')
  }, {
    name: 'indexOf()',
    json: require('../../../examples/graphs/indexOf.json')
  }, {
    name: 'apply()',
    json: require('../../../examples/graphs/apply.json')
  }
]

class Nav extends Component {
  render () {
    const {
      disableAutorun,
      editor,
      enableAutorun,
      graph,
      openExample,
      updateGraph
    } = this.props

    return (
      <nav>
        <ul>
          <li>
            <span>
              Examples
              <ul>
                {examples.map((example) => (
                  <li>
                    <span
                      onClick={() => openExample(example.json)}
                    >
                      {example.name}
                    </span>
                  </li>
                ))}
              </ul>
            </span>
          </li>
          <li>
            <a
              download='graph.json'
              href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph))}
            >Download</a>
          </li>
          <li>
            <button
              onClick={() => { updateGraph(graph) }}
            >
              Save
            </button>
          </li>
          <li>
            <form>
              <label>autorun</label>
              <input
                checked={editor.autorun}
                name='autorun'
                type='checkbox'
                onChange={() => {
                  editor.autorun ? disableAutorun() : enableAutorun()
                }}
              />
            </form>
          </li>
        </ul>
      </nav>
    )
  }
}

Nav.propTypes = {
  disableAutorun: PropTypes.func.isRequired,
  editor: PropTypes.shape({
    autorun: PropTypes.bool.isRequired
  }).isRequired,
  enableAutorun: PropTypes.func.isRequired,
  openExample: PropTypes.func.isRequired,
  updateGraph: PropTypes.func.isRequired
}

export default Nav
