import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 