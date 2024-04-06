const { AsyncLocalStorage } = require('async_hooks');
const { randomUUID } = require('crypto');

const requestContextStore = new AsyncLocalStorage();
const REQUEST_ID_HEADER_NAME = 'x-request-id';

const generateRequestId = () => randomUUID();

const addRequestIdMiddleware = (req, res, next) => {
  const existingRequestId = req.headers[REQUEST_ID_HEADER_NAME];
  const requestId = existingRequestId || generateRequestId();

  res.setHeader(REQUEST_ID_HEADER_NAME, requestId);

  requestContextStore.run(new Map(), () => {
    requestContextStore.getStore().set('requestId', requestId);
    next();
  });
}

// Accessing the request ID in subsequent middleware or routes 
const retrieveRequestId = () => requestContextStore.getStore()?.get('requestId');

module.exports = { addRequestIdMiddleware, retrieveRequestId };
