import { createStore } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { UNINITIATED, INITIATED, COMPLETED } from './lib';
import {
  initiateFetch,
  initiatePost,
  populateTodos,
  addTodo,
  handleError,
} from './actions';

const initialState = {
  getTodos: {
    status: UNINITIATED,
  },
  postTodo: {
    status: UNINITIATED,
    todo: null,
  },
  todos: [],
  error: null,
};

const reducer = handleActions({
  [initiateFetch]: state => ({
    ...state,
    getTodos: {
      status: INITIATED,
    },
  }),
  [initiatePost]: (state, { payload: { todo } }) => ({
    ...state,
    postTodo: {
      status: INITIATED,
      todo,
    },
  }),
  [populateTodos]: (state, { payload: { todos } }) => ({
    ...state,
    getTodos: {
      status: COMPLETED,
    },
    todos,
  }),
  [addTodo]: (state, { payload: { todo } }) => {
    const todos = state.todos.slice(0);
    todos.unshift(todo);
    return {
      ...state,
      postTodo: {
        status: COMPLETED,
        todo: null,
      },
      todos,
    };
  },
  [combineActions(populateTodos, addTodo)]: state => ({
    ...state,
    error: null,
  }),
  [handleError]: (state, { payload: { message } }) => ({
    ...state,
    error: message,
  }),
}, initialState);

export default createStore(
  reducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
