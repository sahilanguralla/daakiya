import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';
import Counter from '../components/Counter';
import CounterActions from '../actions/counter';

function mapStateToProps(state) {
  return {
    counter: state.counter,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
