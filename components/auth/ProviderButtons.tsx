import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

const providers = [
  {
    name: "Google",
    icon: Mail,
    href: "/api/auth/google",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "/api/auth/github",
  },
];

export function ProviderButtons() {
  return (
    <div className="grid gap-4">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = provider.href}
        >
          <provider.icon className="mr-2 h-4 w-4" />
          Continue with {provider.name}
        </Button>
      ))}
    </div>
  );
} 