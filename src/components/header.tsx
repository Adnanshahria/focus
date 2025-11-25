'use client';
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
  const isRegisteredUser = user && !user.isAnonymous;
  const [loading, setLoading] = useState<false | 'deep-focus' | 'dashboard'>(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState('this feature');
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Reset loading state when navigation completes
    setLoading(false);
  }, [pathname]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && pathname === '/deep-focus') {
        router.push('/');
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [pathname, router]);

  const handleDeepFocusClick = async () => {
    setLoading('deep-focus');
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            router.push('/deep-focus');
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Could not toggle fullscreen:", error);
    } finally {
        setLoading(false);
    }
  };
  
  const glassButtonClasses = "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-foreground h-8 px-3 rounded-lg text-xs sm:text-sm";

  const handleRecordClick = (e: React.MouseEvent) => {
    if (!isRegisteredUser) {
        e.preventDefault();
        setAuthFeatureName('view your record');
        setAuthDialogOpen(true);
    } else {
        setLoading('dashboard');
        router.push(`/dashboard`);
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
              onClick={handleDeepFocusClick}
              variant="ghost" 
              size="sm"
              className={cn(glassButtonClasses)}
              aria-label="Deep Focus"
              disabled={loading === 'deep-focus'}
            >
              {loading === 'deep-focus' ? <Loader className="animate-spin" /> : 'Deep Focus'}
            </Button>
            <Button
              onClick={handleRecordClick}
              variant="ghost" 
              size="sm"
              className={cn(glassButtonClasses)}
              aria-label="Record"
              disabled={loading === 'dashboard'}
            >
              {loading === 'dashboard' ? <Loader className="animate-spin" /> : 'Record'}
            </Button>
          <Settings />
        </div>
      </header>
    </>
  );
}
