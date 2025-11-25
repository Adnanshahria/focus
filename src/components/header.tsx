'use client';
import Link from "next/link";
import { Loader } from "lucide-react";
import { Settings } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { AuthRequiredDialog } from "./auth/auth-required-dialog";

export function Header() {
  const { user } = useUser();
  const router = useRouter();
  const isRegisteredUser = user && !user.isAnonymous;
  const [loading, setLoading] = useState<false | 'deep-focus' | 'dashboard'>(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState('this feature');
  
  const pathname = usePathname();

  useEffect(() => {
    // Hide spinner whenever the path changes
    setLoading(false);
  }, [pathname]);
  
  const glassButtonClasses = "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-foreground h-8 px-3 rounded-lg text-xs sm:text-sm";

  const handleNavigationClick = (e: React.MouseEvent<HTMLButtonElement>, destination: 'dashboard' | 'deep-focus') => {
    if (destination === 'dashboard' && !isRegisteredUser) {
        e.preventDefault();
        setAuthFeatureName('view your progress');
        setAuthDialogOpen(true);
    } else {
        setLoading(destination);
        router.push(`/${destination}`);
    }
  }

  return (
    <>
      <AuthRequiredDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        featureName={authFeatureName}
      />
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-2 md:p-4 bg-transparent">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(glassButtonClasses)}
            aria-label="Deep Focus"
            onClick={(e) => handleNavigationClick(e, 'deep-focus')}
            disabled={loading === 'deep-focus'}
          >
            {loading === 'deep-focus' ? <Loader className="animate-spin" /> : 'Deep Focus'}
          </Button>
          <Button
              variant="ghost" 
              size="sm"
              className={cn(glassButtonClasses)}
              aria-label="Progress"
              onClick={(e) => handleNavigationClick(e, 'dashboard')}
              disabled={loading === 'dashboard'}
          >
            {loading === 'dashboard' ? <Loader className="animate-spin" /> : 'Progress'}
          </Button>
          <Settings />
        </div>
      </header>
    </>
  );
}
