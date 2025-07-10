import mongoose from 'mongoose';

async function connectToDatabase() {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
        throw new Error("MONGO_URI environment variable not defined in .env");
    }

    // Check if already connected or connecting
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return mongoose;
    }

    const opts = {
        bufferCommands: false,
    };

    try {
        await mongoose.connect(MONGO_URI, opts);
        console.log("Connected to MongoDB");
        return mongoose;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default connectToDatabase;