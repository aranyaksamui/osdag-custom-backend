import db from "../database/db.js";
import { AppError } from "../utils/errors.js";

// Get all files
export const filesGet = async (req, res) => {
    try {
        const files = await db.file.findMany({ where: { ownerId: req.session.userId } });

        return res.status(200).json({ files });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get a single file by id
export const filesGetById = async (req, res) => {
    try {
        const file = await db.file.findFirst({ 
            where: { 
                ownerId: req.session.userId, 
                id: req.params.id 
            } 
        });

        if (!file) throw new AppError("File not found.", 404);
        if (file.ownerId !== req.session.userId) throw new AppError("You do not have access to this file.", 403);

        return res.status(200).json({ file });
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Download a single file
export const filesDownloadById = async (req, res) => {
    try {
        const file = await db.file.findFirst({
            where: {
                ownerId: req.session.user.Id,
                id: req.params.id
            }
        });

        if (!file) throw new AppError("File not found.", 404);
        if (file.ownerId !== req.session.userId) throw new AppError("Forbidden", 403);

        const placeholderContent = `This is mock file for "${file.fileName}", (${file.mimeType}, ${file.sizeInBytes} bytes).`;
        return res.status(200).type("text/plain").send(placeholderContent);
    }
    catch (error) {
        if (error instanceof AppError) return res.status(error.statusCode).json({ error: error.message });

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}