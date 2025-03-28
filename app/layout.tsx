import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { SearchProvider } from "@/components/search/SearchProvider";
import { ConvexProvider } from "@/components/providers/ConvexProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "B-Workspace",
  description: "A modern workspace for your notes and documents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} transition-colors duration-300 ease-in-out`}>
          <ThemeProvider>
            <ConvexProvider>
              <SearchProvider>
                <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 ease-in-out">
                  {/* Sidebar is fixed, content starts immediately after */}
                  <main className="flex-1 md:pl-56">
                    <div className="w-full px-6 lg:px-12 xl:px-20">
                      {children}
                    </div>
                  </main>
                </div>
              </SearchProvider>
            </ConvexProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

