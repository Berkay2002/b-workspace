import { User } from "@clerk/nextjs/server";

interface DashboardHeaderProps {
  user?: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const greeting = getGreeting();
  const name = user?.firstName || "there";

  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, {name}
      </h1>
      <p className="text-muted-foreground">
        Create and manage your documents in one place
      </p>
    </div>
  );
} 