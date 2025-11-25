'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormattedContent } from './formatted-content';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';

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
      - **Optimized Charts:** Your focus minutes are visualized over different periods. The charts now load faster and more efficiently.
      - **Data-Rich Headers:** Each chart card now shows key stats like 'Total Focus' and 'Pomos' for the selected period, giving you an at-a-glance summary.
      - **Recent Activity Log:** A list of your most recent sessions from today, showing when they happened and how long they were.
      \n**How to use:**
      Sign up for an account, and your completed Pomodoro sessions will be logged automatically. Visit the 'Progress' page anytime to see your updated stats.`,
      manualLog: "**Manual Logging:** Manually add focus sessions you completed without the timer, ensuring your progress chart is always accurate. The redesigned time picker allows you to easily select a time and specify AM/PM.\n\n**How to use:**\nGo to the 'Progress' page and click the 'Log' button. You can specify the date, start time, and duration.",
      offline: "**Offline Support:** The app now works offline! Your focus data is saved on your device and will sync automatically when you reconnect to the internet. You can view your dashboard and track your progress even without a connection.\n\n**How to use:**\nIt works automatically. Just use the app as you normally would.",
    },
    settings: {
      title: "Settings Explained",
      profile: "**User Profile:** Sign up to save your preferences and track your progress across devices. Anonymous users' data is local to the browser and temporary.",
      appearance: "**Appearance:** Switch between a sleek light mode (with white cards) and a cool, AMOLED-friendly dark mode. Enable 'Anti-Burn' to protect OLED screens by subtly moving the timer in Deep Focus mode.",
      timer: "**Timer Durations:** Customize the length of your Pomodoro, short break, and long break sessions to fit your personal workflow. Changes are saved automatically for registered users.",
    },
  },
  bn: {
    title: "অ্যাপ গাইড এবং বৈশিষ্ট্য",
    features: {
      title: "বৈশিষ্ট্য",
      pomodoro: "**পোমোডোরো টাইমার:** আপনার ফোকাস বাড়ানোর জন্য একটি ক্লাসিক ২৫-মিনিটের টাইমার। প্রতিটি সেশনের পরে, একটি ছোট বিরতি নিন। চারটি পোমোডোরোর পরে, একটি দীর্ঘ বিরতি নিন।\n\n**কীভাবে ব্যবহার করবেন:**\nমূল স্ক্রিনে 'পোমোডোরো' নির্বাচন করুন এবং 'স্টার্ট' চাপুন। আপনি '+' বা '-' বোতামে ক্লিক করে ৩ মিনিট যোগ বা বিয়োগ করতে পারেন, অথবা নীচের 'টাইমার' সেটিংসে ডিফল্ট সময়কাল পরিবর্তন করতে পারেন।",
      breaks: "**ছোট এবং দীর্ঘ বিরতি:** আপনাকে কার্যকরভাবে রিচার্জ করতে সাহায্য করার জন্য ৫-মিনিটের ছোট বিরতি এবং ১৫-মিনিটের দীর্ঘ বিরতি অন্তর্নির্মিত।\n\n**কীভাবে ব্যবহার করবেন:**\nঅ্যাপটি স্বয়ংক্রিয়ভাবে সঠিক বিরতির ধরন প্রস্তাব করে। শুধু 'স্টার্ট' চাপুন।",
      addTime: "**সময় যোগ/বিয়োগ:** কাজ শেষ করার জন্য আরও কয়েক মিনিট প্রয়োজন, বা একটি বিরতি ছোট করতে চান? যেকোনো সক্রিয় টাইমার সেশন থেকে দ্রুত ৩ মিনিট যোগ বা বিয়োগ করুন।\n\n**কীভাবে ব্যবহার করবেন:**\nটাইমার চলার সময় মূল স্ক্রিনে বা ডিপ ফোকাস মোডে, '+' বা '-' বোতামে ক্লিক করুন।",
      deepFocus: "**ডিপ ফোকাস মোড:** একটি ইমারসিভ, ফুলস্ক্রিন মোড যা সমস্ত বিক্ষেপ লুকিয়ে রাখে, যখন আপনাকে বাধা দূর করতে হবে তার জন্য উপযুক্ত। এই মোডটি একটি সংক্ষিপ্ত টাইমার ছাড়া সমস্ত UI উপাদান সরিয়ে দিয়ে আপনাকে আপনার কাজে প্রতিশ্রুতিবদ্ধ হতে সাহায্য করে।\n\n**কীভাবে ব্যবহার করবেন:**\nপ্রবেশ করতে হেডারে 'ডিপ ফোকাস' ক্লিক করুন। টাইমারটি একটি কালো পর্দার কেন্দ্রে ভাসবে। ডিভাইসের ব্যাক বোতাম এই মোড থেকে প্রস্থান করবে।",
      progress: `** অগ্রগতি ট্র্যাকিং:** (শুধুমাত্র নিবন্ধিত ব্যবহারকারী) এই শক্তিশালী বিভাগটি আপনাকে আপনার প্রতিশ্রুতি কল্পনা করতে এবং আপনার অগ্রগতি উদযাপন করতে সহায়তা করে, যা একটি সামঞ্জস্যপূর্ণ ফোকাস অভ্যাস গড়ে তোলার জন্য একটি মূল প্রেরণা। এর মধ্যে রয়েছে:
      - **অপ্টিমাইজড চার্ট:** আপনার ফোকাস মিনিটগুলি বিভিন্ন সময়কালে কল্পনা করা হয়। চার্টগুলি এখন দ্রুত এবং আরও দক্ষতার সাথে লোড হয়।
      - **তথ্য সমৃদ্ধ হেডার:** প্রতিটি চার্ট কার্ড এখন নির্বাচিত সময়ের জন্য 'মোট ফোকাস' এবং 'পোমোস'-এর মতো মূল পরিসংখ্যান দেখায়, যা আপনাকে এক নজরে একটি সারাংশ দেয়।
      - **সাম্প্রতিক কার্যকলাপ লগ:** আজকের আপনার সাম্প্রতিকতম সেশনগুলির একটি তালিকা, যা দেখায় কখন সেগুলি ঘটেছে এবং সেগুলি কতক্ষণ ছিল।
      \n**কীভাবে ব্যবহার করবেন:**
      একটি অ্যাকাউন্টের জন্য সাইন আপ করুন, এবং আপনার সম্পন্ন পোমোডোরো সেশনগুলি স্বয়ংক্রিয়ভাবে লগ করা হবে। আপনার আপডেট হওয়া পরিসংখ্যান দেখতে যেকোনো সময় ' অগ্রগতি' পৃষ্ঠাতে যান।`,
      manualLog: "**ম্যানুয়াল লগিং:** টাইমার ছাড়াই সম্পন্ন করা ফোকাস সেশনগুলি ম্যানুয়ালি যোগ করুন, আপনার অগ্রগতি চার্ট সর্বদা সঠিক কিনা তা নিশ্চিত করে। পুনরায় ডিজাইন করা সময় চয়নকারী আপনাকে সহজেই একটি সময় নির্বাচন করতে এবং AM/PM নির্দিষ্ট করতে দেয়।\n\n**কীভাবে ব্যবহার করবেন:**\n' অগ্রগতি' পৃষ্ঠাতে যান এবং 'লগ' বোতামে ক্লিক করুন। আপনি তারিখ, শুরুর সময় এবং সময়কাল নির্দিষ্ট করতে পারেন।",
      offline: "**অফলাইন সমর্থন:** অ্যাপটি এখন অফলাইনে কাজ করে! আপনার ফোকাস ডেটা আপনার ডিভাইসে সংরক্ষিত হয় এবং আপনি ইন্টারনেটে পুনরায় সংযোগ করলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে। আপনি সংযোগ ছাড়াই আপনার ড্যাশবোর্ড দেখতে এবং আপনার অগ্রগতি ট্র্যাক করতে পারেন।\n\n**কীভাবে ব্যবহার করবেন:**\nএটি স্বয়ংক্রিয়ভাবে কাজ করে। আপনি স্বাভাবিকভাবে অ্যাপটি ব্যবহার করুন।",
    },
    settings: {
      title: "সেটিংস ব্যাখ্যা করা হয়েছে",
      profile: "**ব্যবহারকারী প্রোফাইল:** আপনার পছন্দগুলি সংরক্ষণ করতে এবং ডিভাইস জুড়ে আপনার অগ্রগতি ট্র্যাক করতে সাইন আপ করুন। বেনামী ব্যবহারকারীদের ডেটা ব্রাউজারে স্থানীয় এবং অস্থায়ী।",
      appearance: "**অ্যাপিয়ারেন্স:** একটি মসৃণ লাইট মোড (সাদা কার্ড সহ) এবং একটি শীতল, AMOLED-বান্ধব ডার্ক মোডের মধ্যে স্যুইচ করুন। ডিপ ফোকাস মোডে টাইমারটি সূক্ষ্মভাবে সরিয়ে OLED স্ক্রিনগুলিকে রক্ষা করতে 'অ্যান্টি-বার্ন' সক্ষম করুন।",
      timer: "**টাইমার সময়কাল:** আপনার ব্যক্তিগত কর্মপ্রবাহের সাথে মানানসই করার জন্য আপনার পোমোডোরো, ছোট বিরতি এবং দীর্ঘ বিরতি সেশনের দৈর্ঘ্য কাস্টমাইজ করুন। পরিবর্তনগুলি নিবন্ধিত ব্যবহারকারীদের জন্য স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।",
    },
  }
};

export function AppGuide() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const content = guideContent[language];

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select value={language} onValueChange={(value: 'en' | 'bn') => setLanguage(value)}>
                <SelectTrigger id="language-select">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                </SelectContent>
            </Select>
        </div>


      <Accordion type="single" collapsible="true" className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger>{content.features.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
            <Accordion type="multiple" className="w-full">
                <AccordionItem value="pomodoro-timer">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Pomodoro Timer' : 'পোমোডোরো টাইমার'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.pomodoro} />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="breaks">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Short & Long Breaks' : 'ছোট এবং দীর্ঘ বিরতি'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.breaks} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="add-time">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Add/Subtract Time' : 'সময় যোগ/বিয়োগ'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.addTime} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="deep-focus">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Deep Focus Mode' : 'ডিপ ফোকাস মোড'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                         <FormattedContent text={content.features.deepFocus} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="progress-tracking">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Progress Tracking' : 'অগ্রগতি ট্র্যাকিং'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.progress} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="manual-logging">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Manual Logging' : 'ম্যানুয়াল লগিং'}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FormattedContent text={content.features.manualLog} />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="offline-support" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm">{language === 'en' ? 'Offline Support' : 'অফলাইন সমর্থন'}</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0">
                        <FormattedContent text={content.features.offline} />
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
