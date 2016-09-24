import Root from '../components/Root'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  initCanvas
} from '../actions'

const mapStateToProps = (state, ownProps) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    initCanvas
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
