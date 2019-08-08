import { createStore } from 'redux';
import { handleActions } from 'redux-actions';

import {
  startTimer,
  endTimer,
  handleError,
} from './actions';

const initialState = {
  nextId: 0,
  newTimer: null,
  endedTimers: [],
  error: null,
};

const reducer = handleActions({
  [startTimer]: (state, { payload: { delay } }) => ({
    ...state,
    newTimer: { id: state.nextId, delay },
    nextId: state.nextId + 1,
  }),
  [endTimer]: (state, { payload: { timer } }) => {
    const endedTimers = state.endedTimers.slice(0);
    endedTimers.unshift(timer);
    return {
      ...state,
      endedTimers,
      error: null,
    };
  },
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
