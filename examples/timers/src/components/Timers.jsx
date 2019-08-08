import React from 'react';
import PropTypes from 'prop-types';

export default function Timers({ timers }) {
  return (
    <div>
      <h2>Ended Timers</h2>
      <ul>
        {timers.map(({ id, delay }) => <li key={id}>{`{ id: ${id}, delay: ${delay} ms }`}</li>)}
      </ul>
    </div>
  );
}

Timers.propTypes = {
  timers: PropTypes.array.isRequired,
};
