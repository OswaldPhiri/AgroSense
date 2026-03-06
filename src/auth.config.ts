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
                if (credentials?.email === 'admin@agrosense.ai' && credentials?.password === 'password123') {
                    return { id: '1', name: 'Admin User', email: 'admin@agrosense.ai' };
                }
                return null;
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
