import { signIn } from "next-auth/react";
const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Login</h1>
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
};

export default page;
