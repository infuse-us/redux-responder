/* eslint-disable import/prefer-default-export */

export function runTimer(timer) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(timer), timer.delay);
    } catch (err) {
      reject(err);
    }
  });
}
