"use client";
import { Button } from "@/components/ui/button";

import { signIn } from "next-auth/react";
const page = () => {
  return (
    <div>
      <Button onClick={() => signIn("google", { redirectTo: "/interview" })}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default page;
