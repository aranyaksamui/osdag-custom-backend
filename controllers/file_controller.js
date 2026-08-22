import db from "../database/db.js";
import { AppError, FileNotFoundError, ForbiddenError } from "../utils/errors.js";

// Get all files for the logged in user
export const filesGet = async (req, res) => {
    try {
        const files = await db.file.findMany({ where: { ownerId: req.session.userId } });
        if (files.length === 0) throw new FileNotFoundError("No files found for this user.");

        return res.status(200).json({ files });
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get a single file by id for the logged in user
export const filesGetById = async (req, res) => {
    try {
        const file = await db.file.findFirst({ where: { id: req.params.id } });

        if (!file) throw new FileNotFoundError("File not found.");
        if (file.ownerId !== req.session.userId) throw new ForbiddenError("You do not have access to this file.");

        return res.status(200).json({ file });
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Download a single file by id for the logged in user
export const filesDownloadById = async (req, res) => {
    try {
        const file = await db.file.findFirst({ where: { id: req.params.id } });

        if (!file) throw new FileNotFoundError("File not found.");
        if (file.ownerId !== req.session.userId) throw new ForbiddenError("Forbidden");

        const placeholderContent = `This is mock file for "${file.fileName}", (${file.mimeType}, ${file.sizeBytes} bytes).`;
        return res.status(200).type("text/plain").send(placeholderContent);
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}