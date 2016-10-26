import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const {
      fetchGraphIfNeeded,
      graph
    } = this.props

    return (
      <div>
        <div>
          <a
            download='graph.json'
            href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph))}
          >Download</a>
        </div>
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
