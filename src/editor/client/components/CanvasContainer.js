import React, { Component, PropTypes } from 'react'

class CanvasContainer extends Component {
  componentDidMount () {
    this.props.fetchGraphIfNeeded()
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
  fetchGraphIfNeeded: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

CanvasContainer.defaultProps = {
  fetchGraphIfNeeded: Function.prototype,
  id: 'dflow-canvas'
}

export default CanvasContainer
