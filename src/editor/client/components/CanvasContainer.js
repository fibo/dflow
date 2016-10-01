import React, { Component, PropTypes } from 'react'

class CanvasContainer extends Component {
  componentDidMount () {
    const {
      initCanvas,
      id
    } = this.props

    initCanvas(id)
  }

  render () {
    const {
      id
    } = this.props

    return (
      <div
        id={id}
      />
    )
  }
}

CanvasContainer.propTypes = {
  id: PropTypes.string.isRequired
}

CanvasContainer.defaultProps = {
  id: 'dflow-canvas'
}

export default CanvasContainer
