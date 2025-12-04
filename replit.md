# FocusFlow - Pomodoro Timer App

## Overview
FocusFlow is a modern, minimalist Pomodoro and countdown timer application designed for deep work and focus. Built with Next.js 15, React 18, Firebase, and Tailwind CSS, it provides a beautiful and functional timer experience with user authentication and session tracking.

## Project Status
- **Imported:** December 4, 2024
- **Framework:** Next.js 15.3.3
- **Status:** Development server running successfully on Replit

## Recent Changes
- **2024-12-04:** Initial Replit setup completed
  - Configured Next.js dev server to run on port 5000 with 0.0.0.0 host binding
  - Updated next.config.ts to support both development (standard Next.js server) and production (static export)
  - Installed all npm dependencies
  - Configured deployment as static site (outputs to `/out` directory)
  - Set up workflow for Next.js dev server with webview

## Project Architecture

### Tech Stack
- **Framework:** Next.js 15.3.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom UI components
- **Backend:** Firebase (Authentication & Firestore)
- **State Management:** Zustand
- **UI Components:** Radix UI primitives with custom components
- **Animations:** Framer Motion
- **Audio:** Tone.js for timer sounds
- **AI Integration:** Google Genkit for AI features

### Project Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── auth/        # Authentication components
│   ├── dashboard/   # Dashboard statistics
│   ├── firebase/    # Firebase-specific components
│   ├── settings/    # Settings components
│   ├── timer/       # Timer components
│   └── ui/          # Reusable UI components (Radix-based)
├── firebase/        # Firebase configuration and hooks
│   ├── firestore/   # Firestore hooks and types
│   └── hooks/       # Custom Firebase hooks
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
└── store/           # Zustand state management
```

### Key Features
- Pomodoro timer with customizable intervals
- Countdown timer functionality
- Deep focus mode (fullscreen)
- Anonymous and authenticated user support
- Session tracking and statistics
- Theme support (dark/light mode)
- Audio alerts for timer completion
- Wake lock support for continuous timing
- Today's statistics dashboard

### Development Configuration
- **Port:** 5000
- **Host:** 0.0.0.0 (required for Replit)
- **Dev Mode:** Standard Next.js dev server with Turbopack disabled
- **Environment:** Development uses standard Next.js server mode

### Production Configuration
- **Build Output:** Static export
- **Output Directory:** `/out`
- **Deployment:** Static site hosting
- **Images:** Unoptimized (required for static export)
- **Base Path:** Supports GitHub Pages deployment with GITHUB_REPOSITORY env var

### Firebase Configuration
The app uses Firebase for:
- **Authentication:** Anonymous and email-based auth
- **Database:** Firestore for storing timer sessions and user data
- **Security Rules:** Defined in `firestore.rules`

Default Firebase config is available in `src/firebase/config.ts` with fallback values. Environment variables can override defaults:
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

## Development Workflow

### Running the App
The app is configured to run automatically via the "Next.js Dev Server" workflow. It will:
1. Start the Next.js dev server on port 5000
2. Bind to 0.0.0.0 for Replit compatibility
3. Display the webview for immediate preview

### Available Scripts
- `npm run dev` - Start development server (port 5000, host 0.0.0.0)
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with watch mode

### Important Notes
- The app requires Firebase configuration for full functionality
- Anonymous sign-in is initiated automatically for users without accounts
- The dev server must run on port 5000 with host 0.0.0.0 for Replit
- TypeScript build errors are ignored in configuration (can be fixed if needed)

## Known Issues
- Some conflicting star exports in Firebase module warnings (non-breaking)
- LSP diagnostics present but don't affect functionality

## Next Steps
Users can:
1. Customize timer intervals in settings
2. Sign up for a permanent account to save sessions
3. View daily statistics and focus trends
4. Use deep focus mode for distraction-free timing
5. Customize theme and notification preferences
