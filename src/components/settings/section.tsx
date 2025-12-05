'use client';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <AccordionItem value={title} className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
        <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
            </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
            <div className="pl-12">
                {children}
            </div>
        </AccordionContent>
    </AccordionItem>
);
