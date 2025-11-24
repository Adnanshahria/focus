# **App Name**: FocusFlow: Cyberpunk Zen Timer

## Core Features:

- Pomodoro & Countdown Timer Engine: Robust timer logic with Pomodoro presets and custom countdown input. Visual progress ring and auto-start toggle.
- Floating Timer (Anti-Burn-in Mode): When fullscreen, detaches the timer container and makes it float across the screen, bouncing off edges with slight random drift, emulating a DVD screensaver effect using Framer Motion.
- Analytics Dashboard: Glass card summaries (Today's Focus, Total Focus) with animated 'No Data' ring. Trend tabs (Day/Week/Month) drive Recharts histogram (focus time vs. hours). Recent session log with start/end times and durations.
- Settings & Configuration Hub: Glassmorphism sidebar with accordion-style settings: user profile (Firebase Auth), theme engine (accent colors, glass intensity, animation toggle), timer preferences (anti-burn-in, sound control, custom durations), and state persistence.
- User Authentication: Secure user authentication via Firebase Authentication, integrated into the settings panel.
- Data Persistence: Store and retrieve user preferences in Firestore under `users/{userId}/preferences` and focus records in `users/{userId}/dailyStats/{YYYY-MM-DD}`. Enable offline persistence.
- Optimal Break Time Recommender: Uses the LLM to analyze focus history and user activity to dynamically recommend an optimal break duration. The LLM will serve as a tool for recommending custom breaks. 

## Style Guidelines:

- Background: Pure AMOLED Black (#000000) for optimal contrast and energy saving.
- Glassmorphism Panels: `bg-white/5` or `bg-black/40` with `backdrop-blur-xl`, `border-white/10`, and subtle inner shadows to create depth.
- Primary Glow (Focus mode): Cyan/Electric Blue (#7DF9FF) for a vibrant and energetic feel.
- Secondary Glow (Break mode): Purple/Pink (#E0B0FF) to signal rest and relaxation.
- Body and headline font: 'Inter', a grotesque-style sans-serif font, providing a modern, machined look.
- Lucide React or Heroicons (Outline style).
- Use Framer Motion for smooth page transitions, hover effects, and the 'DVD screensaver' bounce.
- All buttons have a 'Scale' effect on click (`whileTap={{ scale: 0.95 }}`) and a glowing border on hover for increased interactivity.