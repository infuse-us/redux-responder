import assert from 'assert';
import { createStore } from 'redux';
import deepEqual from 'deep-equal';
import responder, { connect } from '../src';

const TRIGGER = 'TRIGGER';
const SUCCEED = 'SUCCEED';
const FAIL = 'FAIL';

const trigger = () => ({
  type: TRIGGER,
});
const succeed = () => ({
  type: SUCCEED,
});
const fail = () => ({
  type: FAIL,
});

const initialState = {
  didTrigger: false,
  didSucceed: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TRIGGER:
      return {
        didTrigger: true,
        didSucceed: null,
      };
    case SUCCEED:
      return {
        ...state,
        didSucceed: true,
      };
    case FAIL:
      return {
        ...state,
        didSucceed: false,
      };
    default:
      return state;
  }
};

// Adds state checker as a listener to the Redux store
function testEnhancer(stateChecker) {
  return prevCreateStore => (...args) => {
    const store = prevCreateStore(...args);
    const listener = () => {
      const state = store.getState();
      stateChecker(state, store.dispatch);
    };

    store.subscribe(listener);
    return store;
  };
}

// Assert a test case
function doTest(
  promise,
  sequence,
  done,
) {
  const r = responder(
    [state => state.didTrigger],
    didTrigger => (didTrigger ? promise : null),
    succeed,
    fail,
  );

  const stateChecker = (state, dispatch) => {
    const { expected, reset, action } = sequence.shift();
    if (expected !== undefined) {
      const isEqual = deepEqual(state, expected);
      assert(isEqual);
    }

    if (reset) {
      r.resetRecomputations();
    }

    if (sequence.length === 0) {
      done();
    } else if (action !== undefined) {
      dispatch(action);
    }
  };

  const store = createStore(reducer, testEnhancer(stateChecker));

  const unsubscribers = connect([r], store);

  const { action, unsubscribe } = sequence.shift();
  if (unsubscribe) {
    unsubscribers[0]();
  }
  store.dispatch(action);
}

describe('redux responder', () => {
  it('dispatches correct action when promise resolves', (done) => {
    doTest(
      Promise.resolve(),
      [{
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }, {
        expected: { didTrigger: true, didSucceed: true },
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }],
      done,
    );
  });

  it('dispatches correct action when promise rejects', (done) => {
    doTest(
      Promise.reject(),
      [{
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }, {
        expected: { didTrigger: true, didSucceed: false },
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }],
      done,
    );
  });

  it('does nothing if a promise is not returned', (done) => {
    doTest(
      null,
      [{
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }],
      done,
    );
  });

  it('can be unsubscribed', (done) => {
    doTest(
      Promise.resolve(),
      [{
        unsubscribe: true,
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }],
      done,
    );
  });

  it('can be reset', (done) => {
    doTest(
      Promise.resolve(),
      [{
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }, {
        expected: { didTrigger: true, didSucceed: true },
        reset: true,
        action: trigger(),
      }, {
        expected: { didTrigger: true, didSucceed: null },
      }, {
        expected: { didTrigger: true, didSucceed: true },
      }],
      done,
    );
  });
});
