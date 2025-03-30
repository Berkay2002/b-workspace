import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      {/* Always show sidebar on desktop, but hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content - full width on mobile, adjusted for sidebar on desktop */}
      <main className="h-full">
        {children}
      </main>
    </div>
  );
}
