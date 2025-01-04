"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to Next.js!</h1>
      <Button onClick={() => router.push("/login")}>Login</Button>
    </div>
  );
}
