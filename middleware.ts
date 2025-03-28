import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create custom middleware that extends Clerk's middleware
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // If user is authenticated and trying to access the landing page, redirect to dashboard
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};