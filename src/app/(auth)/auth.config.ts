import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnLogin = pathname.startsWith("/login");
      const isOnInterview = pathname.startsWith("/interview");
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(
          new URL("/interview", nextUrl as unknown as URL)
        );
      }
      if (isOnInterview && !isLoggedIn) {
        return Response.redirect(new URL("/login"));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
