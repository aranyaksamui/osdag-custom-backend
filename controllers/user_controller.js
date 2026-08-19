import db from "../database/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sanitizeEmail } from "../utils/input_sanitizer.js";

// Register a user
export const userRegister = async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

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

        res.status(201).json({ message: "Registered successfully" });
    }
    catch (error) {
        if (error.code === "P2002") return res.status(409).json({ message: "An email with that address already exists." });
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login a user
export const userLogin = async (req, res) => {

}

// Provide user profile data
export const userMe = async (req, res) => {

}