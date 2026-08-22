// Base error class
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

// Auth errors
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

// File errors
// 403 Forbidden error
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden.") {
        super(message, 403);
    }
}

// 404 File or files not found error
export class FileNotFoundError extends AppError {
    constructor(message = "File not found.") {
        super(message, 404);
    }
}
