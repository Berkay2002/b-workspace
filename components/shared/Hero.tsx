import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export function Hero() {
  return (
    <div className="container relative py-20 md:py-32">
      <div className="grid items-center gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              The happier workspace
            </h1>
            <p className="text-xl text-muted-foreground">
              Write. Plan. Collaborate. With a little help from AI.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </SignUpButton>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
          <div className="aspect-square rounded-xl bg-muted" />
          <Image
            src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500&h=500&auto=format&fit=crop"
            alt="B-Workspace Dashboard Preview"
            width={500}
            height={500}
            className="absolute inset-0 rounded-xl object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
            priority
          />
        </div>
      </div>
    </div>
  );
} 