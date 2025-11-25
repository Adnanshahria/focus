'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

const contentData = {
  en: {
    language: "Language",
    version: "Version: v89.3 (Pro Edition)",
    developer: "Developer: Mohammed Adnan Shahria",
    contactLabel: "Contact:"
  },
  bn: {
    language: "ভাষা",
    version: "সংস্করণ: v89.3 (প্রো সংস্করণ)",
    developer: "ডেভেলপার: মোহাম্মদ আদনান শাহরিয়া",
    contactLabel: "যোগাযোগ:"
  }
};

const FormattedContent = ({ text }: { text: string }) => {
    return (
        <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">{text}</p>
        </div>
    );
};

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        <path d="M19.07 4.93A10 10 0 0 0 6.32 17.68 M14.93 19.07A10 10 0 0 0 17.68 6.32"></path>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
);


export function BuildLog() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const content = contentData[language];
  const developerEmail = "adnanshahria2006@gmail.com";
  const whatsappLink = "https://wa.me/8801853452264";
  const telegramLink = "https://t.me/adnanshahria";


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
                    <RadioGroupItem value="en" id="build-lang-en" />
                    <Label htmlFor="build-lang-en" className="text-sm cursor-pointer">English</Label>
                </div>
                <div className="flex items-center space-x-1">
                    <RadioGroupItem value="bn" id="build-lang-bn" />
                    <Label htmlFor="build-lang-bn" className="text-sm cursor-pointer">বাংলা</Label>
                </div>
            </RadioGroup>
        </div>
        <div className="space-y-2 text-sm">
            <FormattedContent text={content.version} />
            <FormattedContent text={content.developer} />
            <div className="flex items-center gap-4 text-muted-foreground pt-2">
                <span className='font-semibold text-foreground'>{content.contactLabel}</span>
                <div className="flex items-center gap-3">
                    <a href={`mailto:${developerEmail}`} className="text-primary hover:underline" aria-label="Email Developer">
                        <Mail className="h-5 w-5" />
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label="Contact on WhatsApp">
                        <WhatsAppIcon className="h-5 w-5" />
                    </a>
                    <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label="Contact on Telegram">
                        <TelegramIcon className="h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
}
