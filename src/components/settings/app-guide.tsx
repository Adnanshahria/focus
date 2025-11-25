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
      pomodoro: "**Pomodoro Timer:** A classic 25-minute timer to boost your focus. After each session, take a short break. After four Pomodoros, take a longer break.\n\n**How to use:**\nSelect 'Pomodoro' on the main screen and press 'Start'. You can add or subtract 3 minutes by clicking the '+' or '-' buttons, or change the default duration in the 'Timer' settings below.",
      breaks: "**Short & Long Breaks:** 5-minute short breaks and 15-minute long breaks are built-in to help you recharge effectively.\n\n**How to use:**\nThe app automatically suggests the correct break type. Just press 'Start'.",
      addTime: "**Add/Subtract Time:** Need a few more minutes to wrap things up, or want to shorten a break? Quickly add or subtract 3 minutes from any active timer session.\n\n**How to use:**\nWhile the timer is running on the main screen or in Deep Focus mode, click the '+' or '-' button.",
      deepFocus: "**Deep Focus Mode:** An immersive, fullscreen mode that hides all distractions, perfect for when you need to eliminate interruptions. This mode helps you commit to your task by removing all UI elements except for a minimalist timer.\n\n**How to use:**\nClick 'Deep Focus' in the header to enter. The timer will float in the center of a black screen. The device's back button will exit this mode.",
      progress: `**Progress Tracking:** (Registered users only) This powerful section helps you visualize your commitment and celebrate your progress, which is a key motivator for building a consistent focus habit. It includes:
      - **Today's Focus & Pomos Cards:** Get an instant overview of your daily achievement with a clear display of total focus minutes and Pomodoros completed today.
      - **Focus Activity Chart:** A dynamic bar chart that shows your focus minutes over different periods. Use the 'Day', 'Week', and 'Month' tabs to see your focus patterns and track your consistency over time. The 'Day' view even breaks down your focus by the hour.
      - **Recent Activity Log:** A list of your most recent sessions from today, showing when they happened and how long they were.
      \n**How to use:**
      Sign up for an account, and your completed Pomodoro sessions will be logged automatically. Visit the 'Progress' page anytime to see your updated stats.`,
      manualLog: "**Manual Logging:** Manually add focus sessions you completed without the timer, ensuring your progress chart is always accurate.\n\n**How to use:**\nGo to the 'Progress' page and click the 'Log' button. You can specify the date, start time, and duration.",
    },
    settings: {
      title: "Settings Explained",
      profile: "**User Profile:** Sign up to save your preferences and track your progress across devices. Anonymous users' data is local to the browser and temporary.",
      appearance: "**Appearance:** Switch between a sleek light mode and a cool dark mode. Enable 'Pixel Shifting' to protect OLED screens by subtly moving the timer in Deep Focus mode.",
      timer: "**Timer Durations:** Customize the length of your Pomodoro, short break, and long break sessions to fit your personal workflow. Changes are saved automatically for registered users.",
    },
    language: "Language"
  },
  bn: {
    title: "অ্যাপ গাইড এবং বৈশিষ্ট্য",
    features: {
      title: "বৈশিষ্ট্য",
      pomodoro: "**পোমোডোরো টাইমার:** আপনার মনোযোগ বাড়ানোর জন্য একটি ক্লাসিক ২৫-মিনিটের টাইমার। প্রতিটি সেশনের পরে, একটি ছোট বিরতি নিন। চারটি পোমোডোরোর পরে, একটি দীর্ঘ বিরতি নিন।\n\n**কিভাবে ব্যবহার করবেন:**\nপ্রধান স্ক্রিনে 'Pomodoro' নির্বাচন করুন এবং 'Start' চাপুন। আপনি '+' বা '-' বোতামে ক্লিক করে ৩ মিনিট যোগ বা বিয়োগ করতে পারেন, অথবা নীচের 'টাইমার' সেটিংসে ডিফল্ট সময়কাল পরিবর্তন করতে পারেন।",
      breaks: "**ছোট এবং দীর্ঘ বিরতি:** আপনাকে কার্যকরভাবে রিচার্জ করতে সাহায্য করার জন্য ৫-মিনিটের ছোট বিরতি এবং ১৫-মিনিটের দীর্ঘ বিরতি রয়েছে।\n\n**কিভাবে ব্যবহার করবেন:**\nঅ্যাপটি স্বয়ংক্রিয়ভাবে সঠিক বিরতির ধরন নির্বাচন করে। শুধু 'Start' চাপুন।",
      addTime: "**সময় যোগ/বিয়োগ করুন:** কাজ শেষ করতে আরও কয়েক মিনিট প্রয়োজন, বা বিরতি ছোট করতে চান? যেকোনো সক্রিয় টাইমার সেশনে দ্রুত ৩ মিনিট যোগ বা বিয়োগ করুন।\n\n**কিভাবে ব্যবহার করবেন:**\nটাইমার চলাকালীন প্রধান স্ক্রিনে বা ডিপ ফোকাস মোডে '+' বা '-' বোতামে ক্লিক করুন।",
      deepFocus: "**ডিপ ফোকাস মোড:** একটি সম্পূর্ণ স্ক্রিন মোড যা সমস্ত বিভ্রান্তি লুকিয়ে রাখে, যখন আপনাকে বাধা দূর করতে হবে তার জন্য উপযুক্ত। এই মোডটি আপনাকে একটি মিনিমালিস্ট টাইমার ছাড়া সমস্ত UI উপাদানগুলি সরিয়ে দিয়ে আপনার কাজে প্রতিশ্রুতিবদ্ধ হতে সাহায্য করে।\n\n**কিভাবে ব্যবহার করবেন:**\nপ্রবেশ করতে হেডারে 'Deep Focus'-এ ক্লিক করুন। টাইমারটি একটি কালো পর্দার কেন্দ্রে ভাসবে। ডিভাইসের ব্যাক বোতাম টিপলে এই মোড থেকে বেরিয়ে আসা যাবে।",
      progress: `**অগ্রগতি ট্র্যাকিং:** (শুধুমাত্র নিবন্ধিত ব্যবহারকারী) এই শক্তিশালী বিভাগটি আপনাকে আপনার প্রতিশ্রুতি কল্পনা করতে এবং আপনার অগ্রগতি উদযাপন করতে সাহায্য করে, যা একটি সামঞ্জস্যপূর্ণ ফোকাস অভ্যাস তৈরির জন্য একটি মূল প্রেরণা। এর মধ্যে রয়েছে:
      - **আজকের ফোকাস এবং পোমোস কার্ড:** আজকের মোট ফোকাস মিনিট এবং সম্পন্ন পোমোডোরোগুলির একটি স্পষ্ট প্রদর্শনের মাধ্যমে আপনার দৈনিক অর্জনের একটি তাত্ক্ষণিক ওভারভিউ পান।
      - **ফোকাস অ্যাক্টিভিটি চার্ট:** একটি ডাইনামিক বার চার্ট যা বিভিন্ন সময়কালে আপনার ফোকাস মিনিটগুলি দেখায়। আপনার ফোকাস প্যাটার্নগুলি দেখতে এবং সময়ের সাথে আপনার ধারাবাহিকতা ট্র্যাক করতে 'দিন', 'সপ্তাহ', এবং 'মাস' ট্যাবগুলি ব্যবহার করুন। 'দিন' ভিউ এমনকি আপনার ফোকাসকে ঘন্টা অনুসারে বিভক্ত করে দেখায়।
      - **সাম্প্রতিক কার্যকলাপ লগ:** আজকের আপনার সবচেয়ে সাম্প্রতিক সেশনগুলির একটি তালিকা, যা দেখায় কখন সেগুলি ঘটেছে এবং সেগুলি কতক্ষণ স্থায়ী ছিল।
      \n**কিভাবে ব্যবহার করবেন:**
      একটি অ্যাকাউন্টের জন্য সাইন আপ করুন, এবং আপনার সম্পন্ন পোমোডোরো সেশনগুলি স্বয়ংক্রিয়ভাবে লগ করা হবে। আপনার আপডেট হওয়া পরিসংখ্যান দেখতে যেকোনো সময় 'Progress' পৃষ্ঠায় যান।`,
      manualLog: "**ম্যানুয়াল লগিং:** টাইমার ছাড়াই সম্পন্ন করা ফোকাস সেশনগুলি ম্যানুয়ালি যুক্ত করুন, যাতে আপনার অগ্রগতি চার্ট সর্বদা সঠিক থাকে।\n\n**কিভাবে ব্যবহার করবেন:**\n'Progress' পৃষ্ঠায় যান এবং 'Log' বোতামে ক্লিক করুন। আপনি তারিখ, শুরুর সময় এবং সময়কাল নির্দিষ্ট করতে পারেন।",
    },
    settings: {
      title: "সেটিংস পরিচিতি",
      profile: "**ব্যবহারকারী প্রোফাইল:** আপনার পছন্দগুলি সংরক্ষণ করতে এবং ডিভাইস জুড়ে আপনার অগ্রগতি ট্র্যাক করতে সাইন আপ করুন। বেনামী ব্যবহারকারীদের ডেটা ব্রাউজারে স্থানীয় এবং অস্থায়ী থাকে।",
      appearance: "**অ্যাপিয়ারেন্স:** লাইট মোড এবং ডার্ক মোডের মধ্যে স্যুইচ করুন। 'Pixel Shifting' সক্ষম করে ডিপ ফোকাস মোডে টাইমারটিকে সূক্ষ্মভাবে সরিয়ে OLED স্ক্রিন রক্ষা করুন।",
      timer: "**টাইমার সময়কাল:** আপনার ব্যক্তিগত ওয়ার্কফ্লো অনুসারে আপনার পোমোডোরো, ছোট বিরতি এবং দীর্ঘ বিরতির সেশনের দৈর্ঘ্য কাস্টমাইজ করুন। নিবন্ধিত ব্যবহারকারীদের জন্য পরিবর্তনগুলি স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।",
    },
    language: "ভাষা"
  }
};

const FormattedContent = ({ text }: { text: string }) => {
    return (
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            {text.split('\n').map((line, index) => {
                if (line.trim() === '') {
                    return <div key={index} className="h-2" />; // Represents a line gap
                }
                const parts = line.split(/(\*\*.*?\*\*)|(\*.*?\*)/g).filter(Boolean);
                return (
                    <p key={index}>
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                                return <em key={partIndex} className="text-foreground/80">{part.slice(1, -1)}</em>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
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
      <Accordion type="single" collapsible="true" className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger>{content.features.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
            <Accordion type="multiple" collapsible="true" className="w-full">
                <AccordionItem value="pomodoro-timer">
                    <AccordionTrigger className="py-2 text-sm">Pomodoro Timer</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.pomodoro} />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="breaks">
                    <AccordionTrigger className="py-2 text-sm">Short & Long Breaks</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.breaks} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="add-time">
                    <AccordionTrigger className="py-2 text-sm">Add/Subtract Time</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.addTime} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="deep-focus">
                    <AccordionTrigger className="py-2 text-sm">Deep Focus Mode</AccordionTrigger>
                    <AccordionContent className="pt-2">
                         <FormattedContent text={content.features.deepFocus} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="progress-tracking">
                    <AccordionTrigger className="py-2 text-sm">Progress Tracking</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.progress} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="manual-logging" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm">Manual Logging</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0">
                        <FormattedContent text={content.features.manualLog} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings">
          <AccordionTrigger>{content.settings.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
             <FormattedContent text={content.settings.profile} />
             <FormattedContent text={content.settings.appearance} />
             <FormattedContent text={content.settings.timer} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
