import React, { PropTypes, Component } from 'react'
import CanvasContainer from './CanvasContainer'
import Nav from './Nav'

// TODO see how to create a modal http://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal

class Root extends Component {
  render () {
    const {
      disableAutorun,
      editor,
      enableAutorun,
      graph,
      openExample,
      readGraphIfNeeded,
      updateGraph
    } = this.props

    return (
      <div>
        <Nav
          disableAutorun={disableAutorun}
          editor={editor}
          enableAutorun={enableAutorun}
          graph={graph}
          openExample={openExample}
          updateGraph={updateGraph}
        />
        <CanvasContainer
          readGraphIfNeeded={readGraphIfNeeded}
        />
      </div>
    )
  }
}

Root.propTypes = Object.assign({},
  Nav.propTypes,
  {
    readGraphIfNeeded: PropTypes.func.isRequired
  }
)

export default Root
