import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

// TODO see how to create a modal http://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal

class Root extends Component {
  render () {
    const {
      disableAutorun,
      editor,
      enableAutorun,
      fetchGraphIfNeeded,
      graph
    } = this.props

    return (
      <div>
        <nav>
          <ul>
            <li>
              <a
                download='graph.json'
                href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph))}
              >Download</a>
            </li>
            <li>
              <form>
                <label forName='autorun' >autorun</label>
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
        <CanvasContainer
          fetchGraphIfNeeded={fetchGraphIfNeeded}
        />
      </div>
    )
  }
}

Root.propTypes = {
  fetchGraphIfNeeded: PropTypes.func.isRequired
}

export default Root
