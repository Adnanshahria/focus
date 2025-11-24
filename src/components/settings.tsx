"use client";

import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserProfile } from "./auth/user-profile";
import { VisualSettings } from "./settings/visual-settings";
import { TimerSettings } from "./settings/timer-settings";
import { useUser } from "@/firebase";

export function Settings() {
  const { user } = useUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Manage your profile, preferences, and timer settings.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>User Profile</AccordionTrigger>
              <AccordionContent>
                <UserProfile />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Appearance</AccordionTrigger>
              <AccordionContent>
                 <VisualSettings />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Timer</AccordionTrigger>
              <AccordionContent>
                <TimerSettings />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
