'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormattedContent } from './formatted-content';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';
import { guideContent } from './app-guide-content';

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
              {Object.entries(content.features.items).map(([key, item]) => (
                <AccordionItem key={key} value={key} className={key === 'offline' ? 'border-b-0' : ''}>
                  <AccordionTrigger className="py-2 text-sm">{item.title}</AccordionTrigger>
                  <AccordionContent className={key === 'offline' ? 'pt-2 pb-0' : 'pt-2'}>
                    <FormattedContent text={item.content} />
                  </AccordionContent>
                </AccordionItem>
              ))}
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
