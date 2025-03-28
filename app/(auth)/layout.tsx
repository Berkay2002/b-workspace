import { auth as getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await getAuth();

  // If the user is already signed in, redirect to the dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">{children}</div>
    </div>
  );
} 