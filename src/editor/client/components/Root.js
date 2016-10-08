import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const {
      fetchGraphIfNeeded,
      initCanvas
    } = this.props

    /*
     * TODO
        <div>
          <button>Save</button>
          <button>Download</button>
        </div>

        */

    return (
      <div>
        <CanvasContainer
          fetchGraphIfNeeded={fetchGraphIfNeeded}
          initCanvas={initCanvas}
        />
      </div>
    )
  }
}

Root.propTypes = {
  initCanvas: PropTypes.func.isRequired
}

export default Root
