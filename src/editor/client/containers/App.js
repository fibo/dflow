import Root from '../components/Root'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  disableAutorun,
  enableAutorun,
  fetchGraphIfNeeded
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    disableAutorun,
    enableAutorun,
    fetchGraphIfNeeded
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
