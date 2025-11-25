'use client';

import { Cog, User, Palette, Timer as TimerIcon, Info, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserProfile } from "./auth/user-profile";
import { VisualSettings } from "./settings/visual-settings";
import { TimerSettings } from "./settings/timer-settings";
import { Separator } from "./ui/separator";
import React from "react";
import { AppGuide } from "./settings/app-guide";


const Section = ({ icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                {React.createElement(icon, { className: "h-5 w-5 text-secondary-foreground" })}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="pl-11">
            {children}
        </div>
    </div>
);

export function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-sm flex flex-col">
        <SheetHeader className="pr-6">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Manage your profile, preferences, and timer settings.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6 space-y-8 pr-6">
            <Section icon={User} title="User Profile">
                <UserProfile />
            </Section>
            <Separator />
            <Section icon={Info} title="App Guide">
                <AppGuide />
            </Section>
            <Separator />
            <Section icon={Palette} title="Appearance">
                <VisualSettings />
            </Section>
             <Separator />
            <Section icon={TimerIcon} title="Timer">
                <TimerSettings />
            </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
