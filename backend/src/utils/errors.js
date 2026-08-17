export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", 400)
    this.errors = errors
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409)
  }
}
