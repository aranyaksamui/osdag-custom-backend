import validator from "validator";
import { ValidationError } from "./errors.js";

// Validate and clean up email input
export const sanitizeEmail = (email) => {
    // Remove HTML tags
    let cleanEmail = validator.escape(email.trim());

    // Normalize
    cleanEmail = validator.normalizeEmail(cleanEmail, { all_lowercase: true });

    // Validate final output
    if (cleanEmail && validator.isEmail(cleanEmail)) return cleanEmail;

    throw new ValidationError("Invalid email provided.");
}