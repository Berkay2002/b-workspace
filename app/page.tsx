import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "@/components/shared/Hero";
import { LogoStrip } from "@/components/shared/LogoStrip";
import { ProductPreview } from "@/components/shared/ProductPreview";
import { TagScroller } from "@/components/shared/TagScroller";
import { TemplateCard } from "@/components/shared/TemplateCard";
import { Footer } from "@/components/shared/Footer";

const featuredTemplates = [
  {
    title: "Project Dashboard",
    description: "Track your team's progress with this comprehensive dashboard template.",
    image: "/templates/project-dashboard.png",
    rating: 4.8,
    isFree: true,
  },
  {
    title: "Meeting Notes",
    description: "Organize your meeting notes and action items efficiently.",
    image: "/templates/meeting-notes.png",
    rating: 4.6,
    isFree: true,
  },
  {
    title: "Content Calendar",
    description: "Plan and organize your content strategy with this calendar template.",
    image: "/templates/content-calendar.png",
    rating: 4.7,
    isFree: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <ProductPreview />
        <TagScroller />
        <section className="container py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <TemplateCard key={template.title} {...template} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 