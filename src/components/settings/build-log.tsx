'use client';

import { Mail } from 'lucide-react';

const content = {
    version: "Version: v89.3 (Pro Edition)",
    developer: "Developer: Mohammed Adnan Shahria",
    contactLabel: "Contact:"
};

const contactInfo = {
    email: "adnanshahria2006@gmail.com",
    whatsapp: "https://wa.me/8801853452264",
    telegram: "https://t.me/adnanshahria",
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
);

export function BuildLog() {
  return (
    <div className="space-y-4">
        <div className="space-y-2 text-sm">
            <FormattedContent text={content.version} />
            <FormattedContent text={content.developer} />
            <div className="flex items-center gap-4 text-muted-foreground pt-2">
                <span className='font-semibold text-foreground'>{content.contactLabel}</span>
                <div className="flex items-center gap-3">
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:opacity-80" aria-label="Email Developer">
                        <Mail className="h-6 w-6" />
                    </a>
                    <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80" aria-label="Contact on WhatsApp">
                        <WhatsAppIcon className="h-6 w-6" />
                    </a>
                    <a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80" aria-label="Contact on Telegram">
                        <TelegramIcon className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
}
