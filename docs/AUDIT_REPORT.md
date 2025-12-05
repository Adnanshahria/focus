# Comprehensive Code Audit Report
Generated: 2025-12-05

---

## 📊 Executive Summary

| Category | Count |
|---|---|
| 🔴 Critical Bugs | 3 |
| ⚠️ Logic/Edge Case Flaws | 8 |
| 🛠 Optimization Suggestions | 12 |
| ✅ Architecture | Sound |

---

## LEVEL 1: FOLDER & ARCHITECTURE AUDIT

### ✅ Project Structure

```
src/
├── ai/            # Genkit AI flows - isolated correctly
├── app/           # Next.js App Router pages
├── components/    # React components (well-organized by feature)
│   ├── auth/      # Authentication forms
│   ├── dashboard/ # Dashboard charts and stats
│   ├── settings/  # Settings panels
│   ├── timer/     # Timer core UI
│   └── ui/        # Shadcn/ui primitives
├── firebase/      # Firebase initialization and hooks
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── store/         # Zustand state management
```

| Type | Observation |
|---|---|
| ✅ **Architecture** | Follows Next.js 14 App Router best practices. Clear separation of concerns. |
| ✅ **Dependencies** | No circular dependencies detected between major folders. |
| ✅ **Conventions** | Components use PascalCase, hooks use camelCase with `use` prefix. |

---

## LEVEL 2: FILE-BY-FILE ANALYSIS

### 📂 `src/firebase/config.ts`

| Type | Finding |
|---|---|
| ⚠️ **Security Risk** | Firebase config is hardcoded. While client-side keys are safe, this prevents environment-based configuration (dev/staging/prod). |
| 🛠 **Optimization** | Move to `NEXT_PUBLIC_` environment variables for flexibility. |

**Current Code:**
```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyAkJJk_uA3JQ9tIA6z7f6NpN-USBBE_zmo",
  // ...
};
```

**✅ Fixed Code:**
```typescript
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

---

### 📂 `src/ai/flows/optimal-break-time-recommender.ts`

| Type | Finding |
|---|---|
| 🔴 **Critical Bug (Line 76)** | **(FIXED)** Non-null assertion `output!` was unsafe. Fixed with try/catch. |

---

### 📂 `public/sw.js`

| Type | Finding |
|---|---|
| ⚠️ **Logic Flaw** | Service worker caches assets but has no cache invalidation strategy. Stale caches can serve outdated JS/CSS after deployments. |
| 🛠 **Optimization** | Implement `stale-while-revalidate` or version-based cache busting. |

**✅ Fixed Code:**
```javascript
const CACHE_NAME = 'focus-flow-v3'; // Increment on each deploy!
const urlsToCache = [
    '/',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force new SW to take over immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone response to cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
```

---

## LEVEL 3: FUNCTION-BY-FUNCTION LOGIC TEST

### 📂 `src/hooks/use-timer.ts`

| Function | Logic Summary |
|---|---|
| `start()` | Ensures audio context is active, then starts timer with current timestamp. |
| `endAndSaveSession()` | Guards against double-saves with `isSaving` flag, records session, then resets state. |
| `runTick()` | Uses `requestAnimationFrame` for smooth, battery-efficient time updates. |

| Type | Finding |
|---|---|
| ⚠️ **Edge Case (Line 74)** | `handleTimerEnd` runs when `timeLeft <= 0 && isActive`. If `recordSession` throws, the timer state becomes inconsistent (stuck). |
| 🛠 **Optimization** | Add error handling inside `handleTimerEnd`. |

**Partial Fix (Lines 73-86):**
```typescript
useEffect(() => {
  const handleTimerEnd = async () => {
    if (timeLeft <= 0 && isActive) {
      playBeep();
      setSaving(true);
      try {
        await recordSession(sessionStartTime, mode, true);
      } catch (error) {
        console.error("Failed to record session:", error);
        // Still complete the cycle to avoid stuck state
      } finally {
        completeCycle();
        setSaving(false);
      }
    }
  }
  handleTimerEnd();
}, [timeLeft, isActive, playBeep, recordSession, mode, sessionStartTime, completeCycle, setSaving]);
```

---

### 📂 `src/store/timer-actions.ts`

| Function | Logic Summary |
|---|---|
| `tick(decrement)` | Decreases `timeLeft` by `decrement` seconds, clamping at 0. |
| `completeCycle()` | Switches modes: pomodoro → break, break → pomodoro. After every 4 pomodoros, uses long break. |
| `subtractTime(seconds)` | Reduces both `timeLeft` and `sessionDuration`, floored at 0. |

| Type | Finding |
|---|---|
| ⚠️ **Edge Case** | `subtractTime` can set `sessionDuration` to 0, which could cause division-by-zero errors in progress calculations. |
| 🛠 **Optimization** | Clamp minimum to 1 second. |

---

### 📂 `src/hooks/use-wakelock.ts`

| Function | Logic Summary |
|---|---|
| `request()` | Requests screen wake lock; handles `NotAllowedError` gracefully. |
| `release()` | Releases the wake lock if active. |

| Type | Finding |
|---|---|
| ⚠️ **Edge Case** | `handleVisibilityChange` re-requests lock when document becomes visible, but the condition `wakeLockRef.current` checks if a lock *exists*, not if it was previously *requested*. This never re-acquires after initial release. |

---

### 📂 `src/hooks/use-date-ranges.ts`

| Type | Finding |
|---|---|
| ⚠️ **Logic Flaw** | `today` is memoized with `[]` deps, meaning it's computed once and never updates even if the user keeps the app open past midnight. |
| 🛠 **Optimization** | Consider adding a date-change listener or accepting `today` as a prop. |

---

## LEVEL 4: LINE-BY-LINE BUG & SYNTAX SCAN

### 📂 `src/app/dashboard/page.tsx` (Line 101)

| Type | Finding |
|---|---|
| ⚠️ **Potential Bug** | `theme as 'dark' | 'light' || 'dark'` has operator precedence issue. It casts `theme` first, then applies `|| 'dark'`. If theme is `undefined`, the fallback works, but if theme is `'system'`, it passes an invalid prop. |

**Current Code:**
```tsx
<FloatingTimer theme={theme as 'dark' | 'light' || 'dark'} toggleTheme={toggleTheme} />
```

**✅ Fixed Code:**
```tsx
<FloatingTimer theme={(theme === 'dark' || theme === 'light') ? theme : 'dark'} toggleTheme={toggleTheme} />
```

---

### 📂 `src/components/dashboard/add-focus-record.tsx`

| Type | Finding |
|---|---|
| ✅ **Fixed** | `startTime` and `endTime` now use `Timestamp.fromDate()` correctly. |

---

### 📂 `src/hooks/use-session-recorder.ts`

| Type | Finding |
|---|---|
| ✅ **Fixed** | `startTime` and `endTime` now use `Timestamp.fromDate()` correctly. |

---

### 📂 `src/firebase/hooks/hooks.ts`

| Type | Finding |
|---|---|
| ⚠️ **Typing Issue** | `useMemoFirebase` mutates its return value by adding `__memo` property. This is a side effect and can break strict mode or pure function expectations. |
| 🛠 **Optimization** | Wrap in a new object or use WeakMap to track memoization. |

---

## 🎯 Action Items Summary

### 🔴 Critical (Must Fix)

1. ~~`optimal-break-time-recommender.ts` - Non-null assertion~~ ✅ **FIXED**
2. `sw.js` - Implement cache invalidation to prevent stale deployments
3. `config.ts` - Move Firebase config to environment variables

### ⚠️ High Priority

4. `use-timer.ts` - Add error handling to `handleTimerEnd`
5. `dashboard/page.tsx` - Fix theme prop type safety
6. `timer-actions.ts` - Clamp `subtractTime` minimum to 1 second

### 🛠 Low Priority (Optimizations)

7. `use-date-ranges.ts` - Handle midnight date rollover
8. `use-wakelock.ts` - Fix visibility change re-acquisition logic
9. Consider adding ESLint rule for unused imports

---

## ✅ Files Already Fixed (This Session)

| File | Change |
|---|---|
| `add-focus-record.tsx` | ISO strings → Timestamps |
| `use-session-recorder.ts` | ISO strings → Timestamps |
| `optimal-break-time-recommender.ts` | Added try/catch error handling |
