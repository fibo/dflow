import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const {
      data,
      fetchGraphIfNeeded,
      info,
      pipe,
      task,
      view
    } = this.props

    return (
      <div>
        <div>
          <a
            download='graph.json'
            href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ data, info, pipe, task, view }))}
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
