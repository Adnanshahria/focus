'use client';

import { Cog, User, Palette, Timer as TimerIcon, Info, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserProfile } from "./auth/user-profile";
import { VisualSettings } from "./settings/visual-settings";
import { TimerSettings } from "./settings/timer-settings";
import { AppGuide } from "./settings/app-guide";
import { BuildLog } from "./settings/build-log";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <AccordionItem value={title}>
        <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
        </AccordionTrigger>
        <AccordionContent className="pl-11 pt-4">
            {children}
        </AccordionContent>
    </AccordionItem>
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
        <div className="flex-1 overflow-y-auto py-6 pr-6">
            <Accordion type="multiple" className="w-full space-y-4">
                <Section icon={User} title="User Profile">
                    <UserProfile />
                </Section>
                <Section icon={Info} title="App Guide">
                    <AppGuide />
                </Section>
                <Section icon={Palette} title="Appearance">
                    <VisualSettings />
                </Section>
                <Section icon={TimerIcon} title="Timer">
                    <TimerSettings />
                </Section>
                 <Section icon={Code2} title="Development">
                    <BuildLog />
                </Section>
            </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
