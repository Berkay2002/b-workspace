import { Card } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    title: "AI-Powered Writing",
    description: "Get intelligent suggestions as you write",
    position: "top-1/4 left-1/4",
  },
  {
    title: "Real-time Collaboration",
    description: "Work together seamlessly with your team",
    position: "top-1/3 right-1/4",
  },
  {
    title: "Smart Templates",
    description: "Start with pre-built templates for any use case",
    position: "bottom-1/4 left-1/3",
  },
];

export function ProductPreview() {
  return (
    <div className="container relative py-20">
      <div className="relative mx-auto max-w-5xl">
        <div className="aspect-video rounded-xl bg-muted" />
        <Image
          src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1080&auto=format&fit=crop"
          alt="B-Workspace Product Preview"
          fill
          className="rounded-xl object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={`absolute ${feature.position} w-64 p-4 shadow-lg`}
          >
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
} 