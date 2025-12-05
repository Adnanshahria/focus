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
import { Accordion } from "@/components/ui/accordion";
import { UserProfile } from "./auth/user-profile";
import { VisualSettings } from "./settings/visual-settings";
import { TimerSettings } from "./settings/timer-settings";
import { AppGuide } from "./settings/app-guide";
import { BuildLog } from "./settings/build-log";
import { Section } from "./settings/section";

export function Settings() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 rounded-full hover:bg-primary/10 transition-colors">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-md flex flex-col border-l border-border/50">
        <SheetHeader className="pr-6 pb-4 border-b border-border/50">
          <SheetTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Settings
          </SheetTitle>
          <SheetDescription className="text-sm">
            Manage your profile, preferences, and timer settings.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6 pr-6 space-y-2">
          <Accordion type="multiple" className="w-full space-y-3">
            <Section icon={User} title="User Profile">
              <UserProfile />
            </Section>
            <Section icon={Palette} title="Appearance">
              <VisualSettings />
            </Section>
            <Section icon={Info} title="App Guide">
              <AppGuide />
            </Section>
            <Section icon={TimerIcon} title="Timer">
              <TimerSettings />
            </Section>
            <Section icon={Code} title="Development">
              <BuildLog />
            </Section>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
