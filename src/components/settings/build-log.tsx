'use client';

import { Mail } from 'lucide-react';

const content = {
    version: "Version: v89.3 (Pro Edition)",
    developer: "Developer: Mohammed Adnan Shahria",
    contactLabel: "Contact:"
};

const FormattedContent = ({ text }: { text: string }) => {
    return (
        <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">{text}</p>
        </div>
    );
};

const GmailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M2.5 4.5h19c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-19c-.83 0-1.5-.67-1.5-1.5v-11c0-.83.67-1.5 1.5-1.5Z" fill="#fff" fillOpacity=".1"/>
        <path d="M4.23 6.94c.43-.42.92-.73 1.6-.82l6.17 4.63 6.17-4.63c.68.09 1.17.4 1.6.82L12 13.1 4.23 6.94Z" fill="#EA4335"/>
        <path d="m21.77 7.23-7.55 5.66c-.33.25-.7.38-1.22.38s-.89-.13-1.22-.38L4.23 7.23a1.45 1.45 0 0 0-1.2 1.34v9.9c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5v-9.9c0-.58-.35-1.1-.83-1.34Z" fill="#4285F4"/>
        <path d="m4.23 18.47 6.17-6.94L2.3 6.91a1.49 1.49 0 0 0-.77 1.66v9.9c0 .53.25.99.64 1.28l2.06-1.28Z" fill="#34A853"/>
        <path d="m19.77 18.47-6.17-6.94 8.1-4.62a1.49 1.49 0 0 1 .77 1.66v9.9c0 .53-.25.99-.64 1.28l-2.06-1.28Z" fill="#FBBC04"/>
    </svg>
);


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path fill="#25D366" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.78.46 3.45 1.29 4.9L2 22l5.25-1.38c1.41.78 3.02 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2z" />
      <path fill="#fff" d="M16.65 13.96c-.18-.09-.93-.46-1.08-.51s-.26-.08-.37.08c-.11.16-.41.51-.5.61s-.18.11-.33.04c-.15-.08-.63-.23-1.21-.75s-.89-1.12-.99-1.32c-.1-.19.1-.3.3-.4s.22-.26.33-.44c.11-.18.05-.33-.03-.41s-.37-.88-.51-1.21c-.14-.33-.28-.28-.37-.28h-.19c-.11 0-.26.04-.37.19s-.41.41-.51.93c-.1.51.11 1.03.26 1.28.15.26.54.81 1.33 1.48.79.67 1.41.93 1.8.98.39.05.74.04.98-.09.24-.13.93-.38 1.06-.75.13-.37.13-.69.09-.75-.04-.06-.15-.09-.33-.18z" />
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="12" fill="#2AABEE"/>
      <path fill="white" d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693L18.953 5.78c.595-.394 1.136-.176.691.218z"/>
    </svg>
);


export function BuildLog() {
  const developerEmail = "adnanshahria2006@gmail.com";
  const whatsappLink = "https://wa.me/8801853452264";
  const telegramLink = "https://t.me/adnanshahria";


  return (
    <div className="space-y-4">
        <div className="space-y-2 text-sm">
            <FormattedContent text={content.version} />
            <FormattedContent text={content.developer} />
            <div className="flex items-center gap-4 text-muted-foreground pt-2">
                <span className='font-semibold text-foreground'>{content.contactLabel}</span>
                <div className="flex items-center gap-3">
                    <a href={`mailto:${developerEmail}`} className="text-primary hover:opacity-80" aria-label="Email Developer">
                        <GmailIcon className="h-6 w-6" />
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80" aria-label="Contact on WhatsApp">
                        <WhatsAppIcon className="h-6 w-6" />
                    </a>
                    <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:opacity-80" aria-label="Contact on Telegram">
                        <TelegramIcon className="h-6 w-6" />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
}
