import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/db/clientPromise';
import authConfig from '@/auth.config';

const isDbConfigured = !!(process.env.MONGODB_URI &&
    process.env.MONGODB_URI.trim() !== '' &&
    !process.env.MONGODB_URI.includes('your_mongodb'));

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: isDbConfigured ? MongoDBAdapter(clientPromise) : undefined,
});
