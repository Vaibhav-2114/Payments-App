import mongoose from "mongoose";

export async function connecttoMongoDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not set");
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to the Database");

    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw err;
    }
}

export async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}
