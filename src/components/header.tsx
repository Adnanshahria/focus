'use client';
import Link from "next/link";
import { Loader } from "lucide-react";
import { Settings } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { AuthRequiredDialog } from "./auth/auth-required-dialog";

export function Header() {
  const { user } = useUser();
  const isRegisteredUser = user && !user.isAnonymous;
  const [loading, setLoading] = useState<false | 'deep-focus' | 'dashboard'>(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState('this feature');
  
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);
  
  const glassButtonClasses = "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-foreground h-8 px-3 rounded-lg text-xs sm:text-sm";

  const handleNavigationClick = (e: React.MouseEvent<HTMLAnchorElement>, destination: 'dashboard' | 'deep-focus') => {
    if (destination === 'dashboard' && !isRegisteredUser) {
        e.preventDefault();
        setAuthFeatureName('view your progress');
        setAuthDialogOpen(true);
    } else if (destination === 'deep-focus' && !isRegisteredUser) {
        e.preventDefault();
        setAuthFeatureName('enter deep focus mode');
        setAuthDialogOpen(true);
    } else {
        setLoading(destination);
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
            <Link href="/deep-focus" passHref onClick={(e) => handleNavigationClick(e, 'deep-focus')}>
              <Button
                asChild
                variant="ghost" 
                size="sm"
                className={cn(glassButtonClasses)}
                aria-label="Deep Focus"
                disabled={loading === 'deep-focus'}
              >
                <a>{loading === 'deep-focus' ? <Loader className="animate-spin" /> : 'Deep Focus'}</a>
              </Button>
            </Link>
            <Link href="/dashboard" passHref onClick={(e) => handleNavigationClick(e, 'dashboard')}>
              <Button
                asChild
                variant="ghost" 
                size="sm"
                className={cn(glassButtonClasses)}
                aria-label="Progress"
                disabled={loading === 'dashboard'}
              >
                <a>{loading === 'dashboard' ? <Loader className="animate-spin" /> : 'Progress'}</a>
              </Button>
            </Link>
          <Settings />
        </div>
      </header>
    </>
  );
}
