import React from 'react'
import PropTypes from 'prop-types'

class CanvasContainer extends React.Component {
  componentDidMount () {
    this.props.readGraphIfNeeded()
  }

  render () {
    const {
      id
    } = this.props

    return (
      <div
        id={id}
        style={{
          height: '100%',
          width: '100%'
        }}
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
