import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'

class Root extends Component {
  render () {
    const {
      fetchGraphIfNeeded
    } = this.props

    /*
     * TODO
        <div>
          <button>Save</button>
          <button>Download</button>
        </div>

        */

    return (
      <div>
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
