"use client";
import { Button } from "@/components/ui/button";

import { signIn, useSession, signOut } from "next-auth/react";
const page = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (session) {
    return (
      <div>
        <h1>Interview</h1>
        <p>Welcome, {session?.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return (
    <div>
      <Button onClick={() => signIn("google", { redirectTo: "/interview" })}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default page;
