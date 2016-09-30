import React, { Component, PropTypes } from 'react'

class DflowCanvas extends Component {
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

DflowCanvas.propTypes = {
  id: PropTypes.string.isRequired
}

DflowCanvas.defaultProps = {
  id: 'dflow-canvas'
}

export default DflowCanvas
