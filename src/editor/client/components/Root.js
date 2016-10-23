import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const {
      fetchGraphIfNeeded,
      view
    } = this.props

    return (
      <div>
        <div>
          <button
            onClick={() => {
              console.log(view)
            }}
          >Download</button>
        </div>
        <CanvasContainer
          fetchGraphIfNeeded={fetchGraphIfNeeded}
        />
      </div>
    )
  }
}

Root.propTypes = {
  fetchGraphIfNeeded: PropTypes.func.isRequired
}

export default Root
