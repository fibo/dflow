import React, { PropTypes, Component } from 'react'

class Nav extends Component {
  render () {
    const {
      disableAutorun,
      editor,
      enableAutorun,
      graph,
      updateGraph
    } = this.props

    return (
      <nav>
        <ul>
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
  updateGraph: PropTypes.func.isRequired
}

export default Nav
