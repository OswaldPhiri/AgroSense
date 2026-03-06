import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim();
const options = {};

let client;
let clientPromise: Promise<any>;

if (!uri || uri === 'your_mongodb_atlas_connection_string' || uri.includes('your_mongodb')) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ MONGODB_URI is not set or using placeholder. Auth.js database features are disabled.');
    }
    clientPromise = Promise.resolve(null);
} else {
    try {
        if (process.env.NODE_ENV === 'development') {
            let globalWithMongo = global as typeof globalThis & {
                _mongoClientPromise?: Promise<MongoClient>;
            };

            if (!globalWithMongo._mongoClientPromise) {
                client = new MongoClient(uri, options);
                globalWithMongo._mongoClientPromise = client.connect().catch(err => {
                    console.error('Failed to connect to MongoDB (dev):', err.message);
                    return null as any;
                });
            }
            clientPromise = globalWithMongo._mongoClientPromise;
        } else {
            client = new MongoClient(uri, options);
            clientPromise = client.connect().catch(err => {
                console.error('Failed to connect to MongoDB (prod):', err.message);
                return null as any;
            });
        }
    } catch (error) {
        console.error('❌ MongoDB client initialization failed:', error);
        clientPromise = Promise.resolve(null);
    }
}

export default clientPromise;
