import React from 'react'
import pkg from '../../../../package.json'

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

class Nav extends React.Component {
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
            <a
              href={pkg.homepage}
              target='_blank'
            >Website</a>
          </li>
          <li>
            <span>
              Examples
              <ul>
                {examples.map((example, i) => (
                  <li key={i}>
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

export default Nav
