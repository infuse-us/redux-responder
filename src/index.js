import { createSelector } from 'reselect';

function isPromise(n) {
  return n !== null && typeof n.then === 'function';
}

function getDispatcher(actionCreator, dispatch) {
  return (value) => {
    const action = actionCreator(value);
    return dispatch(action);
  };
}

function doPromise(
  promise,
  successActionCreator,
  failureActionCreator,
  dispatch,
) {
  return isPromise(promise)
    ? promise
      .then(getDispatcher(successActionCreator, dispatch))
      .catch(getDispatcher(failureActionCreator, dispatch))
    : Promise.resolve();
}

export function connect(responders, store) {
  const { dispatch } = store;
  return responders.map((r) => {
    const listener = () => {
      const state = store.getState();
      r(state, dispatch);
    };
    return store.subscribe(listener);
  });
}

export default function responder(
  selectors,
  promiseProducer,
  successActionCreator,
  failureActionCreator,
) {
  const selector = createSelector(...selectors, (...args) => args);
  let prevRecomputations = 0;

  const r = (state, dispatch) => {
    const values = selector(state);
    const currentRecomputations = selector.recomputations();

    if (currentRecomputations !== prevRecomputations) {
      const promise = promiseProducer(...values);
      const result = doPromise(
        promise,
        successActionCreator,
        failureActionCreator,
        dispatch,
      );
      prevRecomputations = currentRecomputations;
      return result;
    }
    return Promise.resolve();
  };

  r.recomputations = () => selector.recomputations();
  r.resetRecomputations = () => selector.resetRecomputations();
  return r;
}
