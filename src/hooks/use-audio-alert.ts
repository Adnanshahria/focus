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
            // Configure the synth with a custom envelope for a 3-second fade-out
            // and lower volume.
            synthRef.current = new Tone.Synth({
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 3 // 3-second fade-out
                },
                volume: -14 // Corresponds to a lower-medium volume (approx 0.2)
            }).toDestination();
        }
    }, []);
    
    const playBeep = useCallback(() => {
        ensureAudioContext();
        if (synthRef.current) {
            // triggerAttackRelease will now use the custom envelope
            synthRef.current.triggerAttackRelease('C5', '8n');
        }
    }, [ensureAudioContext]);

    return { playBeep, ensureAudioContext };
};
