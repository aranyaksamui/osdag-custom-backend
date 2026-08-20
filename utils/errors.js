// Base error class
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

// 400 Validation error
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

// 401 Unauthorized
export class AuthError extends AppError {
    constructor(message = "Invalid email or password.") {
        super(message, 401);
    }
}