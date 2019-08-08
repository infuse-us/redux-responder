import React from 'react';
import PropTypes from 'prop-types';

export default function Todos({ todos }) {
  return (
    <div>
      <h2>Todos</h2>
      <ul>
        {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
};
