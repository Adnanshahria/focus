'use client';

import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export const useAudioAlert = () => {
    const synthRef = useRef<Tone.Synth | null>(null);

    const ensureAudioContext = useCallback(() => {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
        if (!synthRef.current) {
            synthRef.current = new Tone.Synth().toDestination();
        }
    }, []);
    
    const playBeep = useCallback(() => {
        ensureAudioContext();
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease('C5', '8n');
        }
    }, [ensureAudioContext]);

    return { playBeep, ensureAudioContext };
};
