'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormattedContent } from './formatted-content';

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
      appearance: "**Appearance:** Switch between a sleek light mode and a cool dark mode. Enable 'Anti-Burn' to protect OLED screens by subtly moving the timer in Deep Focus mode.",
      timer: "**Timer Durations:** Customize the length of your Pomodoro, short break, and long break sessions to fit your personal workflow. Changes are saved automatically for registered users.",
    },
  }
};

export function AppGuide() {
  const content = guideContent.en;

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible="true" className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger>{content.features.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
            <Accordion type="multiple" className="w-full">
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
