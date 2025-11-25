'use client';

import { FloatingTimer } from '@/components/timer/floating-timer';
import { useRef } from 'react';

export default function DeepFocusPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const enterFullScreen = () => {
        const elem = containerRef.current;
        if (elem && !document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {});
            } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) { /* IE11 */
                (elem as any).msRequestFullscreen();
            }
        }
    };
    
    return (
        <div ref={containerRef} className="fixed inset-0 bg-background flex flex-col items-center justify-center" onClick={enterFullScreen}>
            <FloatingTimer />
        </div>
    );
}
