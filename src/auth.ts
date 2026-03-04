import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/db/clientPromise';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Mock authorization for MVP
                // In a real app, you would verify against the User model in MongoDB
                if (credentials?.email === 'admin@agrosense.ai' && credentials?.password === 'password123') {
                    return { id: '1', name: 'Admin User', email: 'admin@agrosense.ai' };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, user, token }) {
            if (session.user) {
                // You can add custom fields to the session here
                // session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});
