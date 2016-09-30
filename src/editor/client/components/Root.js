import React, { PropTypes, Component } from 'react'
import Canvas from './Canvas'

class Root extends Component {
  render () {
    const { initCanvas } = this.props

    return (
      <div>
        <Canvas
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
