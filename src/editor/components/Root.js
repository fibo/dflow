import React, { PropTypes, Component } from 'react'
import { Canvas } from 'flow-view/components'

class Root extends Component {
  componentDidMount () {
    this.props.onMountRoot()
  }

  render () {
    const { view, title } = this.props

    console.log(view)

    return (
      <div>
        <span>{title}</span>
        <Canvas {...view} />
      </div>
    )
  }
}

Root.propTypes = {
  title: PropTypes.string
}

Root.defaultProps = { title: 'foo' }

export default Root
