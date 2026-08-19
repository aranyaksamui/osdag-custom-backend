import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import userRoutes from "./routes/user_routes.js";
import db from "./database/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Cors and Session setup
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use(express.json());
app.use(session({
    store: new PrismaSessionStore(db, { 
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}));

// Routers setup
app.use("/api/users", userRoutes);
// app.use("/api/files", fileRoutes);

// Listen on PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})