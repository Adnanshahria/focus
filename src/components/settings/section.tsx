'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <AccordionItem value={title}>
        <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
        </AccordionTrigger>
        <AccordionContent className="pl-11 pt-4">
            {children}
        </AccordionContent>
    </AccordionItem>
);
