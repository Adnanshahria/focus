'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const guideContent = {
  en: {
    title: "App Guide & Features",
    features: {
      title: "Features",
      pomodoro: "**Pomodoro Timer:** A classic 25-minute timer to boost your focus. After each session, take a short break. After four Pomodoros, take a longer break.",
      breaks: "**Short & Long Breaks:** 5-minute short breaks and 15-minute long breaks are built-in to help you recharge effectively.",
      deepFocus: "**Deep Focus Mode:** An immersive, fullscreen mode that hides all distractions, including the status bar and browser UI, for maximum concentration.",
      progress: "**Progress Tracking:** (Registered users only) Visit the 'Progress' page to see your daily and weekly focus history, including total focus time and Pomodoros completed.",
      manualLog: "**Manual Logging:** Manually add focus sessions you completed without the timer from the 'Progress' page.",
    },
    settings: {
      title: "Settings",
      profile: "**User Profile:** Sign up to save your preferences and track your progress across devices. Anonymous users' data is local to the browser.",
      appearance: "**Appearance:** Switch between a sleek light mode and a cool dark mode. Enable 'Pixel Shifting' to protect OLED screens during Deep Focus.",
      timer: "**Timer Durations:** Customize the length of your Pomodoro, short break, and long break sessions to fit your workflow.",
    },
    buildLog: {
      title: "Build Information",
      version: "Version: 21.7 (prime edition)",
      developer: "Developer: Mohammed Adnan Shahria",
    },
    language: "Language"
  },
  bn: {
    title: "অ্যাপ গাইড এবং বৈশিষ্ট্য",
    features: {
      title: "বৈশিষ্ট্য",
      pomodoro: "**পোমোডোরো টাইমার:** আপনার মনোযোগ বাড়ানোর জন্য একটি ক্লাসিক ২৫-মিনিটের টাইমার। প্রতিটি সেশনের পরে, একটি ছোট বিরতি নিন। চারটি পোমোডোরোর পরে, একটি দীর্ঘ বিরতি নিন।",
      breaks: "**ছোট এবং দীর্ঘ বিরতি:** কার্যকরভাবে রিচার্জ করতে আপনাকে সাহায্য করার জন্য ৫-মিনিটের ছোট বিরতি এবং ১৫-মিনিটের দীর্ঘ বিরতি রয়েছে।",
      deepFocus: "**ডিপ ফোকাস মোড:** একটি সম্পূর্ণ স্ক্রিন মোড যা স্ট্যাটাস বার এবং ব্রাউজার UI সহ সমস্ত বিভ্রান্তি লুকিয়ে রাখে, সর্বাধিক ঘনত্বের জন্য।",
      progress: "** অগ্রগতি ট্র্যাকিং:** (শুধুমাত্র নিবন্ধিত ব্যবহারকারী) আপনার দৈনিক এবং সাপ্তাহিক ফোকাস ইতিহাস দেখতে ' অগ্রগতি' পৃষ্ঠাটি দেখুন, যার মধ্যে মোট ফোকাস সময় এবং সম্পন্ন পোমোডোরো রয়েছে।",
      manualLog: "**ম্যানুয়াল লগিং:** ' অগ্রগতি' পৃষ্ঠা থেকে টাইমার ছাড়াই সম্পন্ন করা ফোকাস সেশনগুলি ম্যানুয়ালি যুক্ত করুন।",
    },
    settings: {
      title: "সেটিংস",
      profile: "**ব্যবহারকারী প্রোফাইল:** আপনার পছন্দগুলি সংরক্ষণ করতে এবং ডিভাইস জুড়ে আপনার অগ্রগতি ট্র্যাক করতে সাইন আপ করুন। বেনামী ব্যবহারকারীদের ডেটা ব্রাউজারে স্থানীয় থাকে।",
      appearance: "**অ্যাপিয়ারেন্স:** একটি মসৃণ লাইট মোড এবং একটি শীতল ডার্ক মোডের মধ্যে স্যুইচ করুন। ডিপ ফোকাসের সময় OLED স্ক্রিন রক্ষা করতে 'পিক্সেল শিফটিং' সক্ষম করুন।",
      timer: "**টাইমার সময়কাল:** আপনার ওয়ার্কফ্লো অনুসারে আপনার পোমোডোরো, ছোট বিরতি এবং দীর্ঘ বিরতির সেশনের দৈর্ঘ্য কাস্টমাইজ করুন।",
    },
    buildLog: {
      title: "নির্মাণ তথ্য",
      version: "সংস্করণ: ২১.৭ (প্রাইম সংস্করণ)",
      developer: "ডেভেলপার: মোহাম্মদ আদনান শাহরিয়া",
    },
    language: "ভাষা"
  }
};

const FormattedContent = ({ text }: { text: string }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <p>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </p>
    );
};

export function AppGuide() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const content = guideContent[language];

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">{content.language}</Label>
            <RadioGroup
                defaultValue="en"
                onValueChange={(value: 'en' | 'bn') => setLanguage(value)}
                className="flex items-center space-x-2"
                >
                <div className="flex items-center space-x-1">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en" className="text-sm cursor-pointer">English</Label>
                </div>
                <div className="flex items-center space-x-1">
                    <RadioGroupItem value="bn" id="lang-bn" />
                    <Label htmlFor="lang-bn" className="text-sm cursor-pointer">বাংলা</Label>
                </div>
            </RadioGroup>
        </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger>{content.features.title}</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
            <FormattedContent text={content.features.pomodoro} />
            <FormattedContent text={content.features.breaks} />
            <FormattedContent text={content.features.deepFocus} />
            <FormattedContent text={content.features.progress} />
            <FormattedContent text={content.features.manualLog} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings">
          <AccordionTrigger>{content.settings.title}</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
             <FormattedContent text={content.settings.profile} />
             <FormattedContent text={content.settings.appearance} />
             <FormattedContent text={content.settings.timer} />
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="build-log">
          <AccordionTrigger>{content.buildLog.title}</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm text-muted-foreground">
             <FormattedContent text={content.buildLog.version} />
             <FormattedContent text={content.buildLog.developer} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
