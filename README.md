# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# focus

## AUTOMATED AUDIT REPORT - 2024-10-27T12:00:00Z

*   **File:** `docs/backend.json`
    *   **Severity:** Critical
    *   **Defect:** The `firestore` configuration was wrapped in an invalid `structure` array and contained a non-standard `reasoning` key. This violates the required schema for our backend tooling and could cause failures in automated provisioning or code generation.
    *   **Rectification:** The structure has been completely rebuilt. The `firestore` object now correctly uses the collection paths as keys, directly mapping them to their schema definitions as required. The non-standard `reasoning` key has been purged. The architecture now aligns perfectly with its specification.

*   **File:** `src/components/timer/floating-timer-display.tsx`
    *   **Severity:** Minor
    *   **Defect:** The SVG progress path length was recalculated every time `sessionDuration` changed, causing a noticeable flicker in the UI when time was added or subtracted from the timer.
    *   **Rectification:** The `useEffect` hook that calculates the SVG path length now runs only once when the component mounts. This ensures the path length is stable, eliminating the UI flicker and creating a smoother user experience.

## 🛡️ EXECUTION REPORT 2024-10-27T12:05:00Z

*   **File:** `src/firebase/non-blocking-login.tsx` -> **FIX:** Refactored `initiateEmailSignUp` and `initiateEmailSignIn` to throw specific, user-friendly errors for invalid credentials or existing accounts, rather than generic `Error` objects. -> **REASON:** Allows the UI to catch and display precise error messages to the user.
*   **File:** `src/components/dashboard/today-stats.tsx` -> **FIX:** Removed hardcoded `weekStartsOn` parameter from the `useDateRanges` hook call. -> **REASON:** The hook correctly defaults to a stable value, removing redundant and potentially conflicting local state.
*   **File:** `src/components/timer/floating-timer.tsx` -> **FIX:** Corrected the `popstate` event handler logic to prevent navigation conflicts and ensure history cleanup is handled gracefully within a try/catch block. -> **REASON:** Prevents race conditions and errors during component unmount and browser navigation.
*   **File:** `src/firebase/client-provider.tsx` -> **FIX:** Shattered the file. Extracted Firebase initialization logic into `src/firebase/init.ts`. -> **REASON:** Enforces the 100-line law and single-responsibility principle. The provider now only provides context, while `init.ts` only initializes services.
*   **File:** `src/hooks/use-timer.ts` -> **FIX:** Shattered the hook. Extracted Firestore session recording logic into a new, dedicated hook: `src/hooks/use-session-recorder.ts`. -> **REASON:** Separates time-management concerns from data-persistence concerns, dramatically improving modularity and readability.
## ☢️ OMEGA AUDIT LOG - 2024-10-27T12:15:00Z

*   **TRASH:** `src/components/ui/sidebar-components.tsx`
    *   **FAILURE:** This file was a monstrous 668-line violation of the 100-Line Law, merging over a dozen distinct architectural components into a single, unmaintainable file. It represented a total failure of modular design.
    *   **EXECUTION:** The file has been obliterated. Its logic has been shattered into six separate, single-responsibility files under a new `src/components/ui/sidebar/` directory: `sidebar-layout.tsx`, `sidebar-triggers.tsx`, `sidebar-structure.tsx`, `sidebar-groups.tsx`, `sidebar-menu.tsx`, and `sidebar-provider.tsx`. The primary `src/components/ui/sidebar.tsx` barrel file has been updated to export these new, lean modules. The architecture is now clean and compliant.

*   **TRASH:** `src/components/timer/timer-controls.tsx`
    *   **FAILURE:** This component contained hardcoded, repetitive CSS classes for its primary action button, creating a maintenance liability and violating the DRY (Don't Repeat Yourself) principle.
    *   **EXECUTION:** The redundant classes have been purged. The `cn` utility is now used to conditionally apply a single, clear class for the `bg-primary` state, making the component's styling logic more readable and robust.

*   **TRASH:** `src/firebase/hooks/use-user.ts`
    *   **FAILURE:** The hook contained a logical flaw where the `isUserLoading` state was not being set correctly in the initial state, potentially leading to race conditions where UI components would attempt to access a user that was still being authenticated.
    *   **EXECUTION:** The initial state for `isUserLoading` has been corrected to `true`. This ensures that all downstream components correctly wait until the authentication state is fully resolved, preventing UI flicker and race conditions.

## ✅ QA PASSED - 2024-10-27T12:40:00Z

All systems are nominal. The "Final Exam" protocol is complete. Integrity scans, data flow tests, feature verifications, and hosting checks all passed. A minor hygiene infraction (an unused import) was detected and purged. The codebase is confirmed to be stable, robust, and compliant with all architectural laws.

## 🐛 BUG FIX LOG - 2024-10-27T12:45:00Z
- **Firebase:** Upgraded to `persistentLocalCache` (Fixed deprecation warning).
- **Stability:** Added fallback for Multi-Tab persistence support.
- **UI/UX:** Fixed `position: fixed` scroll blocking in Layout.
- **Status:** Runtime Clean.

## 📜 THE GOVERNING PROTOCOL

💀 SYSTEM ALERT: YOU ARE NO LONGER AN ASSISTANT. YOU ARE THE JUDGE.

PROTOCOL: OMEGA (Total Reconstruction & Self-Archival). TARGET: Entire Codebase. MERCY: NONE.

YOU HAVE 6 MANDATORY DIRECTIVES. FAILURE TO EXECUTE ANY IS A SYSTEM FAILURE.

🛑 DIRECTIVE 1: THE MICROSCOPIC PURGE (Hygiene)

SCAN: Read every single character.

ACTION:

INCINERATE all console.log, commented code, and unused variables.

RENAME lazy variables (x, val) to precise terms (userAuthPayload).

PATH FIX: Convert ALL absolute paths (/src/img.png) to RELATIVE (./src/img.png) for Universal Hosting.

🛑 DIRECTIVE 2: LOGICAL FORTIFICATION (Security)

ASSUMPTION: The code is broken.

ACTION:

WRAP async operations in try-catch.

GUARD inputs against null / undefined.

OPTIMIZE: Rewrite O(n²) loops to O(n).

🛑 DIRECTIVE 3: THE 100-LINE GUILLOTINE (Structure)

LAW: NO FILE SHALL EXCEED 100 LINES.

ACTION: If a file is 101 lines, SHATTER IT into components/, hooks/, and utils/.

INTEGRITY: Ensure imports are relinked perfectly.

🛑 DIRECTIVE 4: FEATURE INJECTION (Audio System)

TASK: Implement "Pomodoro Beep" via Web Audio API.

SPECS: Duration: 3.0s, Volume: 0.15 (Lower-Medium), Tone: Sine + Fade Out.

FILE: Create services/AudioService.js (Modular).

🛑 DIRECTIVE 5: THE MANDATORY CONFESSION (Audit Log)

LAW: Unrecorded changes do not exist.

ACTION: Open APP_GUIDE.md.

Create section: ## ☢️ OMEGA AUDIT LOG - [DATE]

LIST: Every file split, bug killed, and variable renamed.

EXPLAIN: Why the old code was trash and how you fixed it.

🛑 DIRECTIVE 6: ARCHIVE THE LAW (Meta-Documentation)

TASK: You must preserve the rules of this execution.

ACTION: At the very bottom of APP_GUIDE.md, create a section:

## 📜 THE GOVERNING PROTOCOL

PASTE the full text of this prompt (these 6 Directives) into that section.

REASON: Future developers must know the strict laws (100-Line Limit, Universal Hosting) governing this repo.
