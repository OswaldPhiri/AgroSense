import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/db/clientPromise';
import authConfig from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const isDbConfigured = !!(process.env.MONGODB_URI &&
    process.env.MONGODB_URI.trim() !== '' &&
    !process.env.MONGODB_URI.includes('your_mongodb'));

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google,
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email });
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
                    if (!passwordsMatch) return null;

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error('Authorize error:', error);
                    return null;
                }
            },
        }),
    ],
    adapter: isDbConfigured ? MongoDBAdapter(clientPromise) : undefined,
});
