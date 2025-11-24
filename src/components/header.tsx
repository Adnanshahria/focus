'use client';
import Link from "next/link";
import { Timer } from "lucide-react";
import { Settings } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        <Timer className="w-5 h-5" />
    </div>
    <h1 className="text-xl font-bold tracking-tight">
        FocusFlow
    </h1>
  </Link>
)

export function Header() {
  const { user } = useUser();
  const isRegisteredUser = user && !user.isAnonymous;
  
  const glassButtonClasses = "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-foreground h-8 px-3 rounded-lg text-xs sm:text-sm";

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-2 md:p-4 bg-background/80 backdrop-blur-sm border-b">
      <Logo />
      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
            variant="ghost" 
            size="sm"
            asChild
            className={cn(glassButtonClasses)}
            aria-label="Deep Focus"
        >
          <Link href="/deep-focus">
            Deep Focus
          </Link>
        </Button>
        <Button 
            variant="ghost" 
            size="sm"
            asChild
            disabled={!isRegisteredUser} 
            className={cn(glassButtonClasses)}
            aria-label="Progress"
        >
          <Link href="/dashboard">
            Progress
          </Link>
        </Button>
        <Settings />
      </div>
    </header>
  );
}
