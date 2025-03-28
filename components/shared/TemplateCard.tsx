import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Star } from "lucide-react";

interface TemplateCardProps {
  title: string;
  description: string;
  image: string;
  rating: number;
  isFree?: boolean;
}

export function TemplateCard({
  title,
  description,
  image = "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=800&auto=format&fit=crop",
  rating,
  isFree = false,
}: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {isFree && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2"
          >
            Free
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  );
} 