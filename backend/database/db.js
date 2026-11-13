import mongoose from "mongoose";

let connectionPromise;

export async function connecttoMongoDB(mongoUri) {
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not set");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(mongoUri)
            .then(() => console.log("Connected to the Database"))
            .catch((err) => {
                connectionPromise = undefined;
                console.error("MongoDB connection failed:", err);
                throw err;
            });
    }

    await connectionPromise;
}

export async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}
