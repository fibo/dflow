import React from 'react'

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

CanvasContainer.defaultProps = {
  fetchGraphIfNeeded: Function.prototype,
  id: 'dflow-canvas'
}

export default CanvasContainer
