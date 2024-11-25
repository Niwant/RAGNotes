import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";



export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Notes App</h1>
      <div className="space-x-4">
        <Link href="/sign-in">
          <span className="text-blue-500">Sign In</span>
        </Link>
        <Link href="/sign-up">
          <span className="text-blue-500">Sign Up</span>
        </Link>
        <Link href="/protected/dashboard">
          <span className="text-blue-500">Dashboard</span>
        </Link>
      </div>
      <div className="flex justify-end p-4">
      <SignOutButton>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </SignOutButton>
    </div>
    </div>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
