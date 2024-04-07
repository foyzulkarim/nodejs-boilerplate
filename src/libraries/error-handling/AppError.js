class AppError extends Error {
  constructor(name, message, HTTPStatus = 500, isTrusted = true, cause = null) {
    super(message);
    this.name = name;
    this.message = message;
    this.HTTPStatus = HTTPStatus;
    this.isTrusted = isTrusted;
    this.cause = cause;
  }
}

module.exports = { AppError };
