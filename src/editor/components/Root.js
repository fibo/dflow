import React, { PropTypes, Component } from 'react'
import { Canvas } from 'flow-view/components'

class Root extends Component {
  componentDidMount () {
    this.props.onMountRoot()
  }

  render () {
    const { title } = this.props

    return (
      <div>
        <span>{title}</span>
        <Canvas
          width={100}
          height={100}
          links={[]}
          nodes={[]}
        />
      </div>
    )
  }
}

Root.propTypes = {
  title: PropTypes.string
}

Root.defaultProps = { title: 'foo' }

export default Root
