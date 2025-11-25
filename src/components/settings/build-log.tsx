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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.29 4.9L2 22l5.25-1.38c1.41.78 3.02 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2M16.9 15.46c-.19-.1-.67-.33-1.12-.52-.45-.19-1.04-.49-1.2-.69s-.25-.39-.1-.78c.15-.39.78-1 .93-1.2.15-.2.05-.39-.05-.59-.1-.2-.49-.64-.69-.88-.2-.25-.39-.2-.54-.2-.15 0-.39.1-.54.2s-.59.69-.73.83c-.15.15-.29.15-.44.05-.15-.1-.64-.25-1.2-.73s-.93-1.12-1-1.32c-.05-.2.05-.39.15-.54s.34-.39.49-.59c.15-.2.2-.39.15-.54-.05-.15-.54-1.29-.73-1.78-.19-.49-.39-.44-.54-.44h-.1a.53.53 0 0 0-.54.2c-.15.15-.59.69-.73.83s-.29.29-.44.29-.29-.05-.44-.1S9.3 10 8.76 9.46c-.54-.54-1-1.2-1-1.3s-.2-.39-.34-.39h-.39c-.15 0-.34.15-.34.34 0 .19.1.49.25.69.15.2.29.39.39.54s.1.49.15.73c.05.25.25.78.78 1.48.54.7 1.2 1.3 2 1.8.8.5 1.5.8 2.3.9.8.1 1.5.1 2.1-.1.6-.2 1.1-.9 1.3-1.2.2-.3.2-.5.1-.7s-.1-.2-.2-.3z"/>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693L18.953 5.78c.595-.394 1.136-.176.691.218z"/>
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
