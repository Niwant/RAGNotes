import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((req) => {
  const { userId } = req.auth;
  const url = req.nextUrl.clone();

  // Redirect unauthenticated users trying to access /dashboard
  if (!userId && url.pathname === "/dashboard") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard"], // Apply middleware only to /dashboard
};
