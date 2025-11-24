'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { 
  initiateEmailSignUp, 
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { ForgotPasswordDialog } from './forgot-password-dialog';

const signUpSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSignUp = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      await initiateEmailSignUp(auth, data.email, data.password);
      toast({
        title: 'Account Created!',
        description: 'Welcome to FocusFlow.',
      });
      // Submission successful, no need to set isSubmitting to false, as the component will unmount/change
    } catch (error: any) {
      toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: error.message || 'An unexpected error occurred.',
      });
      setIsSubmitting(false); // Re-enable button on error
    }
  };

  const onLogin = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      // Submission successful, no need to set isSubmitting to false, as the component will unmount/change
    } catch(error: any) {
       toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
      });
      setIsSubmitting(false); // Re-enable button on error
    }
  };

  return (
    <>
    <ForgotPasswordDialog open={isForgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="you@example.com" {...registerLogin('email')} />
            {loginErrors.email && <p className="text-destructive text-xs">{loginErrors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" {...registerLogin('password')} />
            {loginErrors.password && <p className="text-destructive text-xs">{loginErrors.password.message}</p>}
          </div>
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-xs text-muted-foreground"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot Password?
            </Button>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="signup">
        <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" placeholder="you@example.com" {...registerSignUp('email')} />
            {signUpErrors.email && <p className="text-destructive text-xs">{signUpErrors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" type="password" {...registerSignUp('password')} />
            {signUpErrors.password && <p className="text-destructive text-xs">{signUpErrors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" {...registerSignUp('confirmPassword')} />
            {signUpErrors.confirmPassword && <p className="text-destructive text-xs">{signUpErrors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
    </>
  );
}
