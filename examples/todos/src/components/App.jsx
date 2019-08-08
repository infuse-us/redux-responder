import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Error from './Error';
import Form from './Form';
import Todos from './Todos';
import { initiatePost } from '../actions';

function App({ todos, error, submit }) {
  return (
    <div>
      <h1>Todo App</h1>
      {error && <Error error={error} />}
      <Form submit={submit} />
      <Todos todos={todos} />
    </div>
  );
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  error: PropTypes.string,
  submit: PropTypes.func.isRequired,
};

App.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  todos: state.todos,
  error: state.error,
});

const mapDispatchToProps = {
  submit: initiatePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
