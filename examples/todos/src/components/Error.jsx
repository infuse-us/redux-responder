import React from 'react';
import PropTypes from 'prop-types';

export default function Error({ error }) {
  return (
    <div>
      <h2>Error</h2>
      <div style={({ color: 'red' })}>
        {error}
      </div>
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.string.isRequired,
};
