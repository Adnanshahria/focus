'use client';

import { useOfflineStatus } from '@/hooks/use-offline-status';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineIndicator() {
    const { isOnline, wasOffline } = useOfflineStatus();

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 text-amber-950 text-sm font-medium shadow-lg backdrop-blur-sm"
                >
                    <WifiOff className="w-4 h-4" />
                    <span>You're offline</span>
                </motion.div>
            )}
            {isOnline && wasOffline && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/90 text-green-950 text-sm font-medium shadow-lg backdrop-blur-sm"
                >
                    <Wifi className="w-4 h-4" />
                    <span>Back online - syncing...</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
