import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Form extends Component {
  static propTypes = {
    nextId: PropTypes.number.isRequired,
    submit: PropTypes.func.isRequired,
  }

  state = {
    delay: 0,
  }

  handleChange(e) {
    this.setState({ delay: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { submit } = this.props;
    const { delay } = this.state;

    submit(parseInt(delay, 10));
    this.setState({ delay: 0 });
  }

  render() {
    const { nextId } = this.props;
    const { delay } = this.state;
    return (
      <div>
        <h2>Start Timer</h2>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div>{`id: ${nextId}`}</div>
          <label htmlFor="timer" style={{ display: 'block' }}>
            delay:&nbsp;
            <input id="timer" type="number" value={delay} onChange={e => this.handleChange(e)} />
            &nbsp;ms
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
