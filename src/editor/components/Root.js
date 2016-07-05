import React, { PropTypes, Component } from 'react'
import { Canvas } from 'flow-view/components'

class Root extends Component {
  componentDidMount () {
    this.props.onMountRoot()
  }

  render () {
    const { onView, view, title } = this.props

    Object.assign(view, onView)
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
