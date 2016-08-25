import React, { PropTypes, Component } from 'react'

class Root extends Component {
  render () {
    const { title } = this.props

    return (
      <div>
        dfloooooooooooow
        <span>{title}</span>
      </div>
    )
  }
}

Root.propTypes = {
  title: PropTypes.string
}

Root.defaultProps = { title: 'foo' }

export default Root
