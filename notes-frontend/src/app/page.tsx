"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  // Content for unauthenticated users
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Notes App</h1>
      <p className="mb-4">Sign in or sign up to access your notes.</p>
      <div className="space-x-4">
        <Link href="/sign-in">
          <span className="text-blue-500 underline">Sign In</span>
        </Link>
        <Link href="/sign-up">
          <span className="text-blue-500 underline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
