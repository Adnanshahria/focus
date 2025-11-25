'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AuthForm } from './auth-form';

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function AuthRequiredDialog({ open, onOpenChange, featureName = 'this feature' }: AuthRequiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription className="pt-2">
            Please sign up or log in to {featureName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <AuthForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
