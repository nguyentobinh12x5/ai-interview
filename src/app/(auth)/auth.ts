import NextAuth, { type User, type Session } from "next-auth";
import { authConfig } from "./auth.config";
import Google from "next-auth/providers/google";

interface ExtendedSession extends Session {
  user: User;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Google],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
