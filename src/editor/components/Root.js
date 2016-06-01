import React, { PropTypes  } from 'react'

const Root = ({
  title
}) => (
  <span>{title}</span>
)

Root.propTypes = {
  title: PropTypes.string
}

Root.defaultProps = { title: 'foo' }

export default Root
