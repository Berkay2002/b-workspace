import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  templateCount: number;
}

export function CreatorCard({ name, role, avatarUrl, templateCount }: CreatorCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {templateCount} template{templateCount !== 1 ? "s" : ""}
          </p>
          <Button variant="outline" size="sm">
            View templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 