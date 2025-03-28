import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { id: "work", label: "Work" },
  { id: "life", label: "Life" },
  { id: "school", label: "School" },
];

export function TemplatesHeader() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Templates</h1>
        <p className="text-muted-foreground">
          Discover and use pre-built templates to speed up your workflow
        </p>
      </div>
      <Tabs defaultValue="work" className="w-full">
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 