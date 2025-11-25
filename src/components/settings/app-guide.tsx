'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormattedContent } from './formatted-content';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';
import { guideContent } from './app-guide-content';

export function AppGuide() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

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
          <AccordionTrigger>{guideContent[language].features.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
            <Accordion type="multiple" className="w-full">
              {Object.entries(guideContent[language].features.items).map(([featureKey, item]) => (
                <AccordionItem key={featureKey} value={featureKey}>
                  <AccordionTrigger className="py-2 text-sm">{item.title}</AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <FormattedContent text={item.content} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="settings">
          <AccordionTrigger>{guideContent[language].settings.title}</AccordionTrigger>
          <AccordionContent className="space-y-3 pl-4 border-l">
             <FormattedContent text={guideContent[language].settings.profile} />
             <FormattedContent text={guideContent[language].settings.appearance} />
             <FormattedContent text={guideContent[language].settings.timer} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
