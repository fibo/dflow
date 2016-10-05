import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'
import Console from './Console'

class Root extends Component {
  render () {
    const {
      fetchGraphIfNeeded,
      initCanvas
    } = this.props

    return (
      <div>
        <div>
          <button>Save</button>
          <button>Download</button>
        </div>
        <CanvasContainer
          fetchGraphIfNeeded={fetchGraphIfNeeded}
          initCanvas={initCanvas}
        />
        <Console />
      </div>
    )
  }
}

Root.propTypes = {
  initCanvas: PropTypes.func.isRequired
}

export default Root
