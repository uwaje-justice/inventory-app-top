/**
 * Wraps an async route handler so that any rejected promise
 * is forwarded to Express's error-handling middleware.
 *
 * Without this, unhandled promise rejections from async controllers
 * would crash the process (Node < 15) or be silently swallowed (Node >= 15),
 * and the client would hang forever waiting for a response.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
