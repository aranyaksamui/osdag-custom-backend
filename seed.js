import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import db from "./database/db.js";

const seed = async () => {
    console.log("Starting with the SEED process...");
    console.log("\n");
    try {
        const rawData = fs.readFileSync(path.resolve("./seed-data.json"), "utf-8");
        const seedData = JSON.parse(rawData);

        for (const seedUser of seedData.users) {
            // Hash the password from plaintext
            const hashedPass = await bcrypt.hash(seedUser.password, 10);

            // Upsert the user into the database (Insert or Update)
            const seededUser = await db.user.upsert({
                where: { email: seedUser.email },
                update: { profile: seedUser.profile },
                create: {
                    id: seedUser.id,
                    email: seedUser.email,
                    password: hashedPass,
                    profile: seedUser.profile
                }
            });

            // Upsert each of the file belonging to the current user (Insert or Update)
            for (const seedUserFile of seedUser.files)
            {
                await db.file.upsert({
                    where: { id: seedUserFile.id },
                    update: {},
                    create: {
                        id: seedUserFile.id,
                        ownerId: seedUser.id,
                        fileName: seedUserFile.fileName,
                        mimeType: seedUserFile.mimeType,
                        sizeBytes: seedUserFile.sizeBytes,
                        uploadedAt: new Date(seedUserFile.uploadedAt)
                    }
                });
            }

            console.log(`Seed User: ${seededUser.email} with ${seedUser.files.length} files!`);
        }
        console.log("\n");
        console.log("Database SEED complete.");
    }
    catch (error) {
        console.error("Error seeding database.\n", error);
        process.exit(1);
    }
    finally {
        await db.$disconnect();
    }
}

seed();