import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">B-Workspace</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/templates" className="transition-colors hover:text-foreground/80">
              Templates
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80">
              Pricing
            </Link>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get B-Workspace Free</Button>
            </SignUpButton>
          </nav>
        </div>
      </div>
    </header>
  );
} 