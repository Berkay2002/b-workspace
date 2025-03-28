import { useUser } from "@clerk/nextjs";

export function PageHeader() {
  const { user } = useUser();
  const hour = new Date().getHours();
  let greeting = "Welcome to B-Workspace";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s what&apos;s happening in your workspace today
      </p>
    </div>
  );
} 