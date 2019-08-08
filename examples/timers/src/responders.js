/* eslint-disable import/prefer-default-export */

import { endTimer, handleError } from './actions';
import { runTimer } from './services';
import responder from '../../../src/index';

export const timerResponder = responder(
  [state => state.newTimer],
  runTimer,
  endTimer,
  handleError,
);
