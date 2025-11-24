'use client';

import { Cog, User, Palette, Timer as TimerIcon, Code, Mail } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Separator } from "./ui/separator";
import React from "react";

const devInfo = {
    name: "Mohammed Adnan Shahria",
    role: "Full Stack Developer",
    version: "21.7 (prime edition)",
    contact: "adnanshahria2006@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/107065099?v=4"
};

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


const DeveloperInfo = () => (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={devInfo.avatar} alt={devInfo.name} />
                <AvatarFallback>{devInfo.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-semibold text-lg">{devInfo.name}</h3>
                <p className="text-sm text-muted-foreground">{devInfo.role}</p>
            </div>
        </div>
        <Separator />
        <div className="text-sm space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{devInfo.version}</span>
            </div>
            <div className="flex justify-between items-center">
                 <span className="text-muted-foreground">Contact</span>
                <Button variant="ghost" size="sm" asChild className="h-auto p-0 font-medium text-primary hover:underline">
                    <Link href={`mailto:${devInfo.contact}`}>
                        <Mail className="w-3 h-3 mr-1.5" />
                        Email
                    </Link>
                </Button>
            </div>
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
            <Section icon={Palette} title="Appearance">
                <VisualSettings />
            </Section>
             <Separator />
            <Section icon={TimerIcon} title="Timer">
                <TimerSettings />
            </Section>
             <Separator />
            <Section icon={Code} title="Development">
                <DeveloperInfo />
            </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
