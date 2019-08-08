import { createActions } from 'redux-actions';

export const {
  startTimer,
  endTimer,
  handleError,
} = createActions({
  START_TIMER: delay => ({ delay }),
  END_TIMER: timer => ({ timer }),
  HANDLE_ERROR: error => ({ error }),
});
