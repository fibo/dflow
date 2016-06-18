import React, { PropTypes } from 'react'

const Root = ({
  title
}) => (
  <div>
    <span>{title}</span>
  </div>
)

Root.propTypes = {
  title: PropTypes.string
}

Root.defaultProps = { title: 'foo' }

export default Root
