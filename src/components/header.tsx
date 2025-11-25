
'use client';
import { Loader, ArrowLeft } from "lucide-react";
import { Settings } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { AuthRequiredDialog } from "./auth/auth-required-dialog";

interface HeaderProps {
  onDeepFocusClick?: () => void;
}

export function Header({ onDeepFocusClick }: HeaderProps) {
  const { user } = useUser();
  const isRegisteredUser = user && !user.isAnonymous;
  const [loading, setLoading] = useState<false | 'dashboard'>(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState('this feature');
  
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname.includes('/dashboard');

  useEffect(() => {
    // Reset loading state when navigation completes
    if (loading === 'dashboard' && pathname !== '/dashboard') {
        setLoading(false);
    }
  }, [pathname, loading]);
  
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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-2 md:p-4 bg-transparent h-16">
        <div className="flex items-center gap-2">
            {isDashboard && (
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            )}
            <Logo />
            {isDashboard && (
                 <h1 className="text-xl font-bold tracking-tight md:hidden">Record</h1>
            )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
            <div className={cn("flex items-center gap-1 sm:gap-2", isDashboard && "hidden md:flex")}>
                <Button
                onClick={onDeepFocusClick}
                variant="ghost" 
                size="sm"
                className={cn(glassButtonClasses)}
                aria-label="Deep Focus"
                >
                Deep Focus
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
            </div>
            
          <Settings />
        </div>
      </header>
    </>
  );
}
