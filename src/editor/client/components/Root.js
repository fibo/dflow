import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const { initCanvas } = this.props

    return (
      <div>
        <CanvasContainer
          initCanvas={initCanvas}
          height={window.innerHeight}
          width={window.innerWidth}
        />
      </div>
    )
  }
}

Root.propTypes = {
  initCanvas: PropTypes.func.isRequired
}

Root.defaultProps = { title: 'foo' }

export default Root
