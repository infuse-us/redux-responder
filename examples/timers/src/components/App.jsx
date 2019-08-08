import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startTimer } from '../actions';

import Error from './Error';
import Form from './Form';
import Timers from './Timers';

function App({
  nextId,
  endedTimers,
  error,
  submit,
}) {
  return (
    <div>
      <h1>Timers App</h1>
      {error && <Error error={error} />}
      <Form nextId={nextId} submit={submit} />
      <Timers timers={endedTimers} />
    </div>
  );
}

App.propTypes = {
  nextId: PropTypes.number.isRequired,
  endedTimers: PropTypes.array.isRequired,
  error: PropTypes.string,
  submit: PropTypes.func.isRequired,
};

App.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  nextId: state.nextId,
  endedTimers: state.endedTimers,
  error: state.error,
});

const mapDispatchToProps = {
  submit: startTimer,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
