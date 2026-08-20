import rateLimit from "express-rate-limit";

// Rate limit login attempts
export const limitLogin = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: { error: "Too many failed attempts. Please try again in a few moments." }
});

// Check for user logged in state
export const requireAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated." });

    next();
}