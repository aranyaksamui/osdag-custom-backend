import db from "../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sanitizeEmail } from "../utils/input_sanitizer.js";
import { AppError, AuthError, ValidationError } from "../utils/errors.js";

// Register a user
export const userRegister = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new ValidationError("Email and password are required.");

    try {
        const sanitizedEmail = sanitizeEmail(email);
        const hashedPass = await bcrypt.hash(password, 10);
        const userId = `usr_${crypto.randomBytes(4).toString("hex")}`;

        const newUser = await db.user.create({
            data: {
                id: userId,
                email: sanitizedEmail,
                password: hashedPass,
                profile: {
                    fullName: "",
                    displayName: sanitizedEmail.split("@")[0],
                    bio: "",
                    createdAt: new Date().toISOString(),
                    role: "user"
                }
            }
        });

        return res.status(201).json({ message: "Registered successfully" });
    }
    catch (error) {
        if (error.code === "P2002") return res.status(409).json({ error: "An account with that email already exists." });

        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Login a user
export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new ValidationError("Email and password are required.");

    try {
        const sanitizedEmail = sanitizeEmail(email);
        const user = await db.user.findUnique({ where: { email } });
        if (!user) throw new AuthError();

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) throw new AuthError();

        req.session.userId = user.id;

        return res.status(200).json({ user: { id: req.session.userId, email: user.email } });
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Provide user profile data
export const userMe = async (req, res) => {
    try {
        const user = await db.user.findUnique({ 
            where: { id: req.session.userId }, 
            select: { email: true, profile: true } 
        });

        return res.status(200).json({ user: { id: req.session.userId, email: user.email } });

        if (!user) throw new AuthError("User not found.");
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}