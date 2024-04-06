const { AsyncLocalStorage } = require('async_hooks');

let currentContext;

export function context() {
  if (currentContext === undefined) {
    currentContext = new AsyncLocalStorage();
  }

  return currentContext;
}
