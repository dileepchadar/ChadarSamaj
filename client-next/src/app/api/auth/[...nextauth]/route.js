import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "your_super_secret_string_here_12345",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'missing_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing_secret',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        // Find or create user in our backend
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          });
          
          if (res.ok) {
            const data = await res.json();
            user.userId = data.userId; // attach our DB's user ID to the user object
            user.role = data.role;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login', // redirect here if sign in fails or is required
  },
});

export { handler as GET, handler as POST };
