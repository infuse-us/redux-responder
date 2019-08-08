# Redux Responder

**Redux without side effects**

Like [Redux Thunk](https://github.com/reduxjs/redux-thunk) or [Redux Saga](https://github.com/redux-saga/redux-saga), Redux Responder enables the incorporation of asynchronous, non-deterministic code into a Redux application. Unlike thunks or sagas, this is done without introducing middleware that alters the handling of action creators or reducers, allowing Redux to remain "a predictable state container for JavaScript apps" without side effects.

There is already a place for asynchronous, non-deterministic behavior in a Redux application: the black box between a change in state and the dispatching of a new action in response to that change. That black box is typically a user mediated by a React UI, but it could just as easily be our own code.

Responder enforces the convention that only a change in state will initiate an unpredictable process that dispatches a single action, executed by either a user or a responder.

**Contents**

1. [Usage](#usage)
2. [Conventions](#conventions)
3. [Testing](#testing)
4. [Examples](#examples)

## Usage

Responders use [Reselect](https://github.com/reduxjs/reselect) under the hood, and work in a similar way. If any of the values specified by an array of state selectors change, they are passed to a function that optionally returns a promise. Action creators can be specified for both success and failure of that promise.

```javascript
import responder, { connect } from 'redux-responder';
import store from './store';

const fetchResponder = responder(
  [
    state => state.doFetch,
    state => state.url,
  ],
  (doFetch, url) => {
    if (doFetch) {
      return fetch(url);
    }
  },
  response => ({
    type: 'FETCH_SUCCESS',
    payload: { response },
  }),
  error => ({
    type: 'FETCH_FAILURE',
    payload: { error },
  }),
);

connect([fetchResponder], store);
```

## Conventions

Using responders should require minimal changes to your application, aside from the structure of your Redux store. Using other solutions, an action could initiate an API request directly without touching any data in the store. Using a responder, a similar action would *only* be able to update a value in the store, which would then in turn trigger a responder.

### Using Thunk

```javascript
const initialState = {
  response: null,
  error: null,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'STORE_RESPONSE':
      state.response = payload.response;
      break;
    case 'ERROR':
      state.error = payload.error;
      break;
    default:
  }
  return state;
};

const initiateRequest = () => async (dispatch) => {
  dispatch({
    type: 'REQUEST_INITIATED',
  });
  try {
    const response = await fetch('http://example.com');
    const json = await response.json();
    dispatch({
      type: 'STORE_RESPONSE',
      payload: {
        response: json,
      },
    });
  } catch (error) {
    dispatch({
      type: 'ERROR',
      payload: {
        error,
      },
    });
  }
};
```

### Using Responder

```javascript
import responder from 'redux-responder';

const initialState = {
  requestStatus: 'UNINITIATED',
  response: null,
  error: null,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'REQUEST_INITIATED':
      state.requestStatus = 'INITIATED';
      break;
    case 'STORE_RESPONSE':
      state.requestStatus = 'COMPLETE';
      state.response = payload.response;
      break;
    case 'ERROR':
      state.error = payload.error;
      break;
    default:
  }
  return state;
};

const initiateRequest = () => ({
  type: 'REQUEST_INITIATED',
});

const requestResponder = responder(
  [state => state.requestStatus],
  async (requestStatus) => {
    if (requestStatus === 'INITIATED') {
      const response = fetch('http://example.com');
      return response.json();
    }
    return null;
  },
  response => ({
    type: 'STORE_RESPONSE',
    payload: {
      response,
    },
  }),
  error => ({
    type: 'ERROR',
    payload: {
      error,
    },
  }),
);
```

Although the latter is slightly more verbose, notice that a snapshot of the store at any time will include information about the exact state of the request (in addition to the other benefits described above).

You are free to structure your store however you like, but some conventions have emerged during development that might be useful. Because a responder needs to receive all relevant data for a request from the store, one solution is to maintain an entry in the store for each request:

```javascript
const initialState = {
  someGetRequest: {
    status: 'UNINITIATED',
  },
  somePostRequest: {
    status: 'UNINITIATED',
    body: null,
  },
};
```

Alternately, you can maintain a single entry in the store to be used for initiating any request:

```javascript
const initialState = {
  request: {
    status: 'UNINITIATED',
    method: null,
    url: null,
    body: null,
  },
};
```

In a final example, you could use a single entry and responder to choose between predefined request services:

```javascript
const initialState = {
  request: {
    status: 'UNINITIATED',
    requestId: null,
    body: null,
  },
};

const services = {
  SOME_GET_REQUEST: async () => {
    const response = await fetch('http://example.com');
    return response.json();
  },
  SOME_POST_REQUEST: async (requestBody) => {
    const response = await fetch(
      'http://example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(requestBody),
      },
    );
    return response.json();
  },
};

const requestResponder = responder(
  [state => state.request],
  (request) => {
    if (request.status === 'INITIATED') {
      const requestService = services[request.requestId];
      return requestService(request.body);
    }
    return null;
  },
);
```

## Testing

Responders can be unit tested without connecting them to a Redux store.

An unconnected responder is a function that takes a state and dispatch function as its arguments, and returns a promise that resolves when the dispatch is done (or deliberately skipped). By calling it you are simulating an update to the given state.

```javascript
import assert from 'assert';
import responder from 'redux-responder';

// Typical action creator
function evaluateHappinessCreator(isHappy) {
  return {
    type: 'EVALUATE_HAPPINESS',
    payload: { isHappy },
  };
}

// Always fires the action when state.value changes
const evaluateHappinessResponder = responder(
  [state => state.value],
  value => Promise.resolve(value === 'happy'),
  evaluateHappinessCreator,
);

// Simulate a sequence of store states
const states = [
  { value: 'sad' },
  { value: 'sad' },
  { value: 'happy' },
];

// Actions should only be dispatched when the
// value changes in states[0] and states[2]
const expectedActions = [
  evaluateHappinessCreator(false),
  evaluateHappinessCreator(true),
];

// Mock dispatch function stores actions in an array
const actualActions = [];
const dispatch = action => actualActions.push(action);

// Invoke the responder with each sequential state
const invokeResponder = state => evaluateHappinessResponder(state, dispatch);
const promises = states.map(invokeResponder);

// Ensure expected actions were dispatched once all responders are done
describe('Example test', () => {
  it('passes', (done) => {
    Promise.all(promises)
      .then(() => {
        assert.deepEqual(actualActions, expectedActions);
        done();
      });
  });
});
```

## API

`connect` returns an array of functions that correspond to the array of responders passed into it. These functions can be called to unsubscribe the responder from the Redux store.

```javascript
import { connect } from 'redux-responder';
import { responderA, responderB } from './responders';
import store from './store';

const unsubscribers = connect([responderA, responderB], store);

// Unsubscribe responderB
unsubscribers[1]();
```

Just like [Reselect](https://github.com/reduxjs/reselect), the internal memory of the selectors' previous values can be reset to guarantee that the responder will evaluate whether its promise should be executed on the next state update.

```javascript

responderA.recomputations(); // 0

// On the first state update, the responder will evaluate whether its promise should be executed
responderA({ value: 0 }, dispatch);

responderA.recomputations(); // 1

// Since the state hasn't changed, nothing will happen
responderA({ value: 0 }, dispatch);

responderA.recomputations(); // 1

// After resetting, the responder will evaluate once again
responderA.resetRecomputations();

responderA.recomputations(); // 0

responderA({ value: 0 }, dispatch);

responderA.recomputations(); // 1
```

## Examples

There are two projects in the `examples` directory that illustrate the integration of responders into a React/Redux project.
