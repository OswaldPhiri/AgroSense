import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_atlas_connection_string' || MONGODB_URI.includes('your_mongodb')) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ MONGODB_URI is not set or using placeholder. Database features are disabled.');
    }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
