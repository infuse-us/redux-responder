import { populateTodos, addTodo, handleError } from './actions';
import { getTodos, postTodo } from './services';
import { INITIATED } from './lib';
import responder from '../../../src/index';

export const getTodosResponder = responder(
  [state => state.getTodos],
  ({ status }) => {
    if (status === INITIATED) {
      return getTodos();
    }
    return null;
  },
  populateTodos,
  handleError,
);

export const postTodoResponder = responder(
  [state => state.postTodo],
  ({ status, todo }) => {
    if (status === INITIATED) {
      return postTodo(todo);
    }
    return null;
  },
  addTodo,
  handleError,
);
