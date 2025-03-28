import { currentUser } from "@clerk/nextjs/server";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RecentlyVisited } from "@/components/dashboard/RecentlyVisited";
import { LearnSection } from "@/components/dashboard/LearnSection";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { FeaturedTemplates } from "@/components/dashboard/FeaturedTemplates";

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="container py-10">
      <DashboardHeader user={user} />
      <RecentlyVisited />
      <LearnSection />
      <UpcomingEvents />
      <FeaturedTemplates />
    </div>
  );
} 