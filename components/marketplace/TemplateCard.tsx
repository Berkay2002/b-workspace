import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

interface TemplateCardProps {
  id: string;
  title: string;
  creator: string;
  rating: number;
  isFree: boolean;
  imageUrl: string;
  onUse: (id: string) => void;
}

export function TemplateCard({
  id,
  title,
  creator,
  rating,
  isFree,
  imageUrl,
  onUse,
}: TemplateCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {isFree && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-white/90 text-green-600 hover:bg-white/90"
          >
            Free
          </Badge>
        )}
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground">
          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">by {creator}</p>
          <button
            onClick={() => onUse(id)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Use Template
          </button>
        </div>
      </CardContent>
    </Card>
  );
} 