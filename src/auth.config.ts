import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

// Edge-compatible auth config (no MongoDB adapter - can't run in Edge Runtime)
const authConfig: NextAuthConfig = {
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Allow the demo mock login for MVP testing
                if (credentials.email === 'admin@agrosense.ai' && credentials.password === 'password123') {
                    return { id: 'demo123', name: 'Demo Farmer', email: 'admin@agrosense.ai' };
                }

                try {
                    // Connect to DB if not already
                    const mongoose = await import('mongoose');
                    if (mongoose.connection.readyState !== 1) {
                        await mongoose.connect(process.env.MONGODB_URI!);
                    }
                    const User = (await import('@/models/User')).default;
                    const bcrypt = (await import('bcryptjs')).default;

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
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const isAuth = !!auth?.user;
            const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
            const isDashboardPage = nextUrl.pathname.startsWith('/dashboard');

            if (isAuthPage) {
                if (isAuth) return Response.redirect(new URL('/dashboard', nextUrl));
                return true;
            }

            if (isDashboardPage) {
                if (!isAuth) return Response.redirect(new URL('/login', nextUrl));
            }

            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: '/login',
    },
    trustHost: true,
};

export default authConfig;
