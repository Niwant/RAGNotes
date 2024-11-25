"use client"

import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <p>Your email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
