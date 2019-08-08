import { createActions } from 'redux-actions';

export const {
  initiateFetch,
  initiatePost,
  populateTodos,
  addTodo,
  handleError,
} = createActions({
  INITIATE_FETCH: undefined,
  INITIATE_POST: todo => ({ todo }),
  POPULATE_TODOS: todos => ({ todos }),
  ADD_TODO: todo => ({ todo }),
  HANDLE_ERROR: error => ({ error }),
});
