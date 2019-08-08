import assert from 'assert';
import responder from '../src';

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
