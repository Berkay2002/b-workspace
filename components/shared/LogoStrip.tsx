import { Badge } from "@/components/ui/badge";

const companies = [
  { name: "Company 1", color: "bg-blue-500" },
  { name: "Company 2", color: "bg-green-500" },
  { name: "Company 3", color: "bg-purple-500" },
  { name: "Company 4", color: "bg-amber-500" },
  { name: "Company 5", color: "bg-pink-500" },
];

export function LogoStrip() {
  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
        {companies.map((company) => (
          <div
            key={company.name}
            className="relative h-8 w-24 transition-all hover:opacity-80"
          >
            <Badge 
              variant="outline" 
              className={`h-full w-full ${company.color} flex items-center justify-center text-white`}
            >
              {company.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
} 