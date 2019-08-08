import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Form extends Component {
  static propTypes = {
    submit: PropTypes.func.isRequired,
  }

  state = {
    title: '',
  }

  handleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { submit } = this.props;
    const { title } = this.state;

    submit({ title });
    this.setState({ title: '' });
  }

  render() {
    const { title } = this.state;
    return (
      <div>
        <h2>Add Todo</h2>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="text" value={title} onChange={e => this.handleChange(e)} />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
